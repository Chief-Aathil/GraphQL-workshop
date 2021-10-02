const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const EmpDept = sequelize.define('employee_department', {
  empId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  deptId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = EmpDept;
