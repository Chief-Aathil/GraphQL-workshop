const { Sequelize } = require('sequelize');
const { dbConfig } = require('../config/appConfig');
const { username, password, database } = dbConfig.credentials;

const sequelize = new Sequelize(database, username, password, dbConfig.env);

module.exports = sequelize;
