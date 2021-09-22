const DataLoader = require('dataloader');
const Department = require('../models/departments');
const Employee = require('../models/employees');
const EmpDept = require('../models/employeeDepartment');
const { Op } = require('sequelize');

const batchGetEmployeeOfDepartmentsById = async (departmentIds) => {
  // I return a map of [DepartmentId]: DepartmentEmployeeDetails
  const employeeOfDepartments = await EmpDept.findAll({
    where: { deptId: { [Op.in]: departmentIds } },
    include: Employee,
  });

  const employeeOfDepartmentsMap = departmentIds.map((departmentId) => {
    return employeeOfDepartments.filter((department) => department.deptId === departmentId);
  });
  return employeeOfDepartmentsMap;
};

const departmentEmployeesLoader = new DataLoader(batchGetEmployeeOfDepartmentsById);

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
      employeesOfDepartment = await departmentEmployeesLoader.load(department.id);

      return employeesOfDepartment.map((employeeOfDept) => {
        return employeeOfDept.getDataValue('employee');
      });
    },
  },
};
module.exports = resolvers;
