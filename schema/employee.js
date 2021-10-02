const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Employee {
    id: Int!
    name: String!
    username: String!
    password: String!
    age: Int!
    isActive: Boolean!
    department: [Department]
  }

  type Query {
    getEmployees: [Employee]
    getEmployee(id: Int!): Employee
  }

  type Mutation {
    createEmployee(input: CreateEmployeeInput!): Employee!
    updateEmployee(id: Int!, input: UpdateEmployeeInput!): Employee!
    deleteEmployee(id: Int!): Employee!
    addDepartment(employeeId: Int!, departmentId: Int!): Employee!
  }

  input CreateEmployeeInput {
    name: String!
    username: String!
    password: String!
    age: Int!
  }

  input UpdateEmployeeInput {
    name: String!
    age: Int!
    isActive: Boolean!
  }
`;

module.exports = typeDefs;
