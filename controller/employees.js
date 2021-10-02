const Employee = require('../models/employees');
const EmpDept = require('../models/employeeDepartment');
const bcrypt = require('bcrypt');
const loginConstants = require('../constants/login.constants');

exports.getAllEmployees = (req, resp, next) => {
  Employee.findAll()
    .then((employees) => {
      resp.status(200).json({
        message: 'Employees retrieved successfully',
        employees: employees,
      });
    })
    .catch((err) => {
      console.log(err);
      resp.status(404).json({
        message: 'Employees not found',
      });
    });
};

exports.getEmployee = (req, resp, next) => {
  const empId = req.params.id;
  Employee.findByPk(empId)
    .then((employee) => {
      resp.status(200).json({
        employee,
      });
    })
    .catch((err) => {
      console.log(err);
      resp.status(404).json({
        message: 'Employee not found',
      });
    });
};

exports.getEmployeeDepartments = (req, resp, next) => {
  const empId = req.params.id;
  EmpDept.findAll({
    attributes: ['deptId'],
    where: { empId: empId },
  })
    .then((employeeDepartments) => {
      resp.status(200).json({
        employeeDepartments,
      });
    })
    .catch((err) => {
      console.log(err);
      resp.status(404).json({
        message: 'Employee Departments not found',
      });
    });
};

exports.postEmployee = (req, resp, next) => {
  const name = req.body.name;
  const age = req.body.age;
  const username = req.body.username;
  const password = bcrypt.hashSync(req.body.password, loginConstants.salt);
  Employee.create({
    name: name,
    age: age,
    username,
    password,
  })
    .then((employee) => {
      resp.status(200).json({
        message: 'Employee created successfully',
        employee,
      });
    })
    .catch((err) => {
      console.log(err);
      resp.status(404).json({
        message: 'Employee creation failed',
      });
    });
};

exports.postEmployeeDepartment = (req, resp, next) => {
  const empId = req.params.id;
  const deptId = req.body.deptId;

  EmpDept.create({
    empId: empId,
    deptId: deptId,
  })
    .then((employeeDepartment) => {
      resp.status(200).json({
        message: `Department ${employeeDepartment.deptId} added for employee ${employeeDepartment.empId}`,
      });
    })
    .catch((err) => {
      console.log(err);
      resp.status(404).json({
        message: 'Adding department for employee failed',
      });
    });
};

exports.editEmployee = (req, resp, next) => {
  const id = req.params.id;
  const name = req.body.name;
  const age = req.body.age;
  const isActive = req.body.isActive;
  Employee.findByPk(id)
    .then((employee) => {
      (employee.name = name), (employee.age = age), (employee.isActive = isActive);
      return employee.save();
    })
    .then((employee) => {
      resp.status(200).json({
        message: 'Employee updated successfully',
        employee,
      });
    })
    .catch((err) => {
      console.log(err);
      resp.status(404).json({
        message: 'Employee updation failed',
      });
    });
};

exports.deleteEmployee = (req, resp, next) => {
  const id = req.params.id;
  Employee.findByPk(id)
    .then((employee) => {
      return employee.destroy();
    })
    .then(() => {
      resp.status(200).json({
        message: 'Employee deleted successfully',
      });
    })
    .catch((err) => {
      console.log(err);
      resp.status(404).json({
        message: 'Employee deletion failed',
      });
    });
};
