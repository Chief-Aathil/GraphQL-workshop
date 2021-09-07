const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Department = sequelize.define('department', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Department;
