const Employee = require("../models/employees");

// const employees1 = [
//   {
//     name: 'Janet Terry',
//     username: 'Giovanny.Schroeder',
//     password: '$2a$10$un48JbMk1txjgTiwW3LtUOPICXhldCgRLy9XrdjwWCGmrhCfBXLEy',
//     age: 10,
//     isActive: true,
//   },
// ];

const resolvers = {
  Query: {
    async getEmployees() {
      const employees = await Employee.findAll();
      return employees;
    },

    async getEmployee(parent, args, context, info) {
      const employee = await Employee.findOne({ where: { id: Number(args.id) } });
      return employee;
    },
  },
  Mutation: {
    async editName(parent, args, context, info) {
      console.log('here',args);
      return null;
    }
  }
};

module.exports = resolvers;
