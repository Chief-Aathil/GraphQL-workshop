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
const typeDefs = require('./schema/schema');
const resolvers = require('./resolver/resolver');
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
// app.use(notFound); // TODO: Middleware is blocking access to /graphql
// app.use(convertError);

let apolloServer = null;
async function startGqlServer() {
  apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
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
  .sync({ logging: console.log })
  .then((result) => {
    console.log('Listening for requests at http://localhost:7001');
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
