const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Employee {
    name: String!
    username: String!
    password: String!
    age: Int!
    isActive: Boolean!
    id:Int!
  }

  type Query {
    getEmployees: [Employee]
    getEmployeeById(id:Int!):Employee
  }
  type Mutation{
    addEmployee(name:String!,age:Int!,username:String!,password:String!): String
    updateEmployee(id:Int!,name:String!,age:Int!,username:String!,password:String!,isActive:Boolean!):Employee
    deleteEmployee(id:Int!):String
  }
`;

module.exports = typeDefs;
