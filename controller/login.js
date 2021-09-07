'use strict';

exports.__esModule = true;
const key = require('../constants/login.constants');
const employee = require('../models/employees');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateLoginInput } = require('../middleware/authorization.middlware');

exports.login = async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  let emp;
  if (!isValid) {
    res.status(400).json(errors);
  } else {
    emp = await employee.findOne({
      where: {
        username: req.body.username,
      },
    });
    const password = bcrypt.hashSync(req.body.password, key.salt);
    try {
      const isMatch = await bcrypt.compare(req.body.password, emp.getDataValue('password'));
      if (isMatch) {
        const payload = { name: emp.getDataValue('name'), age: emp.getDataValue('age') };
        const token = jwt.sign(payload, key.jwtSecret, { expiresIn: 3600 });

        res.status(200).json({ idToken: 'Bearer ' + token });
      } else {
        res.status(400).json({ error: 'Bad request' });
      }
    } catch (err) {
      res.status(400).json({
        error: 'Bad request',
        stack: err,
      });
    }
  }
};
