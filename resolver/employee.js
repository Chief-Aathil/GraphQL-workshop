const Employee = require('../models/employees');
const bcrypt = require('bcrypt');
const loginConstants = require('../constants/login.constants');
const EmpDept = require('../models/employeeDepartment');
const Department = require('../models/departments');
const { Op } = require('sequelize');
const { AuthenticationError } = require('apollo-server-express');

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
      if (!context.user) {
        throw new AuthenticationError('Unauthenticated user cannot create a new employee');
      }
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
    async addDepartment(root, { employeeId, departmentId }, context) {
      await EmpDept.create({
        empId: employeeId,
        deptId: departmentId,
      });

      return await Employee.findByPk(employeeId);
    },
  },
  Employee: {
    async department(employee) {
      departmentsOfEmployee = await EmpDept.findAll({
        where: { empId: employee.id },
        include: Department,
      });
      return departmentsOfEmployee.map((departmentOfEmp) => {
        return departmentOfEmp.getDataValue('department');
      });
    },
  },
};
module.exports = resolvers;
