const graphql = require('graphql');

const Employee = new graphql.GraphQLObjectType({
  name: 'Employee',
  fields: {
    name: {
      type: graphql.GraphQLString,
      description: 'Name of the employee',
    },
    username: {
      type: graphql.GraphQLString,
      description: 'Username of the employee',
    },
    password: {
      type: graphql.GraphQLString,
      description: 'Password of the employee account',
    },
    age: {
      type: graphql.GraphQLInt,
      description: 'Age of the employee',
    },
    isActive: {
      type: graphql.GraphQLBoolean,
      description: 'Whether the employee is soft deleted or not',
    },
  },
});

module.exports = Employee;