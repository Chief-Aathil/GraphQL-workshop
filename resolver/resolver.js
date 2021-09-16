const e = require('express');
const Employee = require('../models/employees');
const EmpDept = require('../models/employeeDepartment');
const bcrypt = require('bcrypt');
const loginConstants = require('../constants/login.constants');


const resolvers = {
  Query: {
    getEmployees: () => {
      return Employee.findAll().then((employees) => employees);
    },
    getEmployeeById: (parent, args) => {
      return Employee.findByPk(args.id)
        .then((employee) => {
          return employee;
        })
        .catch((err) => {
          console.log(err);
          return 'failed';
        });
    },
  },
  Mutation: {
    addEmployee: (parent, args) => {
      return Employee.create({
        name: args.name,
        age: args.age,
        username: args.username,
        password: args.password,
      })
        .then((employee) => {
          return 'Employee created successfully';
        })
        .catch((err) => {
          console.log(err);

          return 'Employee creation failed';
        });
    },

    updateEmployee: (parent, args) => {
      const { id, name, age, password, isActive } = args;
      return Employee.findByPk(id)
        .then((employee) => {
          (employee.name = name), (employee.age = age), (employee.isActive = isActive), (employee.password = password);
          return employee.save();
        })
        .then((emp) => {
          return emp;
        })
        .catch(() => {});
    },

    deleteEmployee: (parent, args) => {
      const { id } = args;
      return Employee.findByPk(id)
        .then((employee) => {
          return employee.destroy();
        })
        .then(() => {
          return 'Employee deleted successfully';
        })
        .catch((err) => {
          return 'Employee deletion failed';
        });
    },
  },
};

module.exports = resolvers;
