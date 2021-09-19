const Employee = require('../models/employees');
const key = require('../constants/login.constants');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const resolvers = {
  Mutation: {
    async login(root, { input }, context) {
      const { username, password } = input;

      employee = await Employee.findOne({ where: { username } });

      try {
        const isMatch = await bcrypt.compare(password, employee.getDataValue('password'));
        if (isMatch) {
          const payload = { name: employee.getDataValue('name'), age: employee.getDataValue('age') };
          const token = jwt.sign(payload, key.jwtSecret, { expiresIn: 3600 });

          return { employee, idToken: 'Bearer ' + token };
        } else {
          console.log('Throw Invalid Password Exception');
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
module.exports = resolvers;
