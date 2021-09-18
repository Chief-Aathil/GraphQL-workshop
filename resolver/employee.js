const Employee = require('../models/employees');
const bcrypt = require('bcrypt');
const loginConstants = require('../constants/login.constants');

const resolvers = {
  Query: {
    async getEmployees(root, args, context) {
      return await Employee.findAll({ where: { isActive: true } });
    },
    async getEmployee(root, { id }, context) {
      return await Employee.findByPk(id);
    },
  },
  Mutation: {
    async createEmployee(root, { input }, context) {
      const { name, age, username, password } = input;
      const hashedPassword = bcrypt.hashSync(password, loginConstants.salt);

      return await Employee.create({
        name,
        age,
        username,
        password: hashedPassword,
      });
    },
    async updateEmployee(root, { id, input }, context) {
      const { name, age, isActive } = input;

      const employee = await Employee.findByPk(id);
      employee.name = name;
      employee.age = age;
      employee.isActive = isActive;
      return await employee.save();
    },
    async deleteEmployee(root, { id }, context) {
      const employee = await Employee.findByPk(id);
      employee.isActive = false;

      return await employee.save();
    },
  },
};
module.exports = resolvers;
