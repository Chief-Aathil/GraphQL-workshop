const Department = require('../models/departments');
const Employee = require('../models/employees');
const EmpDept = require('../models/employeeDepartment');
const { Op } = require('sequelize');

const resolvers = {
  Query: {
    async getDepartments(root, args, context) {
      return await Department.findAll();
    },
    async getDepartment(root, { id }, context) {
      return await Department.findByPk(id);
    },
  },
  Mutation: {
    async createDepartment(root, { input }, context) {
      const { name } = input;

      return await Department.create({
        name,
      });
    },
    async updateDepartment(root, { id, input }, context) {
      const { name } = input;

      const department = await Department.findByPk(id);
      department.name = name;
      return await department.save();
    },
    async deleteDepartment(root, { id }, context) {
      const department = await Department.findByPk(id);

      await department.destroy();
      return id;
    },
  },
  Department: {
    async employee(department) {
      employeesOfDepartment = await EmpDept.findAll({
        where: { deptId: department.id },
      });
      const employeeIds = employeesOfDepartment.map((empDept) => empDept.empId);

      if (employeeIds.length) {
        return await Employee.findAll({ where: { id: { [Op.in]: employeeIds } } });
      } else {
        return [];
      }
    },
  },
};
module.exports = resolvers;
