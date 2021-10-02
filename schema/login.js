const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Mutation {
    login(input: LoginInput!): LoginResponse!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  type LoginResponse {
    employee: Employee!
    idToken: String!
  }
`;

module.exports = typeDefs;
