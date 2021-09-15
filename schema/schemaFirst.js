const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Employee {
    name: String!
    username: String!
    password: String!
    age: Int!
    isActive: Boolean!
  }

  type Query {
    getEmployees: [Employee]
  }
`;

module.exports = typeDefs;
