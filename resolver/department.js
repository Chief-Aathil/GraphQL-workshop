const Department = require('../models/departments');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub(); // https://www.apollographql.com/docs/apollo-server/data/subscriptions/#production-pubsub-libraries

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

      createdDepartment = await Department.create({
        name,
      });
      pubsub.publish('DEPARTMENT_CREATED', {
        departmentCreated: createdDepartment,
      });

      return createdDepartment;
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
  Subscription: {
    departmentCreated: {
      subscribe: () => pubsub.asyncIterator(['DEPARTMENT_CREATED']),
    },
  },
};
module.exports = resolvers;
