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
// app.use(notFound); // TODO: Middleware is blocking access to /graphql
// app.use(convertError);

let apolloServer = null;
async function startGqlServer() {
  const schemaFirst = makeExecutableSchema({
    typeDefs: [employeeSchema, departmentSchema, loginSchema],
    resolvers: merge(employeeResolver, departmentResolver, loginResolver),
  }); // Manually built the schema from the resolvers and SDL

  apolloServer = new ApolloServer({
    schema: schemaFirst, // Which schema to use? Code first vs Schema first
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
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
    console.log('Listening for requests at http://localhost:7001');
    app.listen(7001);
  })
  .catch((err) => {
    console.log(err);
  });
