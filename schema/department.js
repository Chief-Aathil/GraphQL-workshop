const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Department {
    id: Int!
    name: String!
    employee: [Employee]
  }

  type Query {
    getDepartments: [Department]
    getDepartment(id: Int!): Department!
  }

  type Mutation {
    createDepartment(input: CreateDepartmentInput!): Department
    updateDepartment(id: Int!, input: UpdateDepartmentInput!): Department
    deleteDepartment(id: Int!): Int!
  }

  input CreateDepartmentInput {
    name: String!
  }

  input UpdateDepartmentInput {
    name: String!
  }
`;

module.exports = typeDefs;
