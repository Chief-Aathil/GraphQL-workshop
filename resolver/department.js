const Department = require('../models/departments');

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
    async employee(department, {}, context) {
      employeesOfDepartment = await context.departmentEmployeesLoader.load(department.id);

      return employeesOfDepartment.map((employeeOfDept) => {
        return employeeOfDept.getDataValue('employee');
      });
    },
  },
};
module.exports = resolvers;
