require('./config/appConfig');

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const { notFound, convertError } = require('./middleware/errorMiddleware');

const Employee = require('./models/employees');
const Department = require('./models/departments');
const EmpDept = require('./models/employeeDepartment');

const empRoutes = require('./routes/employees');
const depRoutes = require('./routes/departments');
const loginRoute = require('./routes/login');

const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema'); // Part of the standard apollo-server package
const codeFirstSchema = require('./schema/codeFirst');
const employeeSchema = require('./schema/employee');
const employeeResolver = require('./resolver/employee');
const departmentSchema = require('./schema/department');
const departmentResolver = require('./resolver/department');
const loginSchema = require('./schema/login');
const loginResolver = require('./resolver/login');
const { merge } = require('lodash');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const { authorizeGql } = require('./middleware/authorization.middlware');

const DataLoader = require('dataloader');
const batchGetDepartmentOfEmployeesById = require('./util/employeeDataloader');
const batchGetEmployeeOfDepartmentsById = require('./util/departmentDataloader');

const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');

/**
 * Express instance
 * @public
 */
const app = express();

// parse body params and attaches them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/employees', empRoutes);
app.use('/departments', depRoutes);
app.use('/login', loginRoute);

// Error Middlewares
app.use(notFound);
app.use(convertError);

const httpServer = createServer(app); // Pass the express app to the httpServer for subscriptions

let apolloServer = null;
async function startGqlServer() {
  const schemaFirst = makeExecutableSchema({
    typeDefs: [employeeSchema, departmentSchema, loginSchema],
    resolvers: merge(employeeResolver, departmentResolver, loginResolver),
  }); // Manually built the schema from the resolvers and SDL

  apolloServer = new ApolloServer({
    schema: schemaFirst, // Which schema to use? Code first vs Schema first
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              // The drainServer event fires when Apollo Server is starting to shut down because ApolloServer.stop() has been invoked (either explicitly by your code, or by one of the termination signal handlers).
              subscriptionServer.close();
            },
          };
        },
      },
    ],
    formatError: (error) => {
      return {
        message: error.extensions?.exception?.response?.message || error.message,
        path: error.path,
        extensions: {
          statusCode: error.extensions?.code,
          error: error.extensions?.exception?.stacktrace[0],
        },
      };
    },
    context: ({ req }) => {
      let user;

      // Initialize the dataloaders per context
      const employeeDepartmentsLoader = new DataLoader(batchGetDepartmentOfEmployeesById);
      const departmentEmployeesLoader = new DataLoader(batchGetEmployeeOfDepartmentsById);

      if (req.headers.authorization) {
        user = authorizeGql(req);
        if (!user) {
          throw new AuthenticationError("Couldn't authenticate this user");
        }
      }
      return { user, employeeDepartmentsLoader, departmentEmployeesLoader };
    },
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  const subscriptionServer = SubscriptionServer.create(
    { schema: schemaFirst, execute, subscribe },
    { server: httpServer, path: apolloServer.graphqlPath }
  );
}
startGqlServer();

// Employee.hasMany(EmpDept);
EmpDept.belongsTo(Employee, {
  foreignKey: {
    name: 'empId',
  },
  onDelete: 'CASCADE',
});

// Department.hasMany(EmpDept);
EmpDept.belongsTo(Department, {
  foreignKey: {
    name: 'deptId',
  },
  onDelete: 'CASCADE',
});

sequelize
  .sync()
  .then((result) => {
    httpServer.listen(7001, () => {
      console.log(`🚀 Query endpoint ready at http://localhost:7001${apolloServer.graphqlPath}`);
      console.log(`🚀 Subscription endpoint ready at ws://localhost:7001${apolloServer.graphqlPath}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
