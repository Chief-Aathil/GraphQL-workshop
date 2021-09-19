const loginConstants = require('../constants/login.constants');
const Validator = require('validator');
const ifEmpty = require('../util/checkForEmpty');
const jsonwebtoken = require('jsonwebtoken');

const validateLoginInput = (data) => {
  var errors = {};
  data.username = !ifEmpty(data.username) ? data.username : '';
  data.password = !ifEmpty(data.password) ? data.password : '';
  if (Validator.isEmpty(data.username)) {
    errors.email = 'Email is required';
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password is required';
  }
  return {
    errors: errors,
    isValid: ifEmpty(errors),
  };
};

const authorize = (req, res, next) => {
  const token = req.headers.authorization.split(' ');
  const data = jsonwebtoken.verify(token[1], loginConstants.jwtSecret);
  next();
};

const authorizeGql = (req) => {
  const token = req.headers.authorization.split(' ');
  const data = jsonwebtoken.verify(token[1], loginConstants.jwtSecret);
  return data;
};

module.exports = {
  authorize,
  authorizeGql,
  validateLoginInput,
};
