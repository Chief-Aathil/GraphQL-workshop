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

const { merge } = require('lodash');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');

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

let apolloServer = null;
async function startGqlServer() {
  const schemaFirst = makeExecutableSchema({
    typeDefs: [employeeSchema, departmentSchema],
    resolvers: merge(employeeResolver, departmentResolver),
  }); // Manually built the schema from the resolvers and SDL

  apolloServer = new ApolloServer({
    schema: schemaFirst, // Which schema to use? Code first vs Schema first
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
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
