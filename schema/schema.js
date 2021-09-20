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
    getEmployees: [Employee],
    getEmployee(id:String!): Employee
  }

  type Mutation {
    editName(id: String!, name: String): Employee
  }  
`;

module.exports = typeDefs;
