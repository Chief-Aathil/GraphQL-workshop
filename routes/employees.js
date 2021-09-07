const express = require('express');
const validate = require('express-validation');
const empController = require('../controller/employees');
const { authorize } = require('../middleware/authorization.middlware');
const {
  idParamsSchema,
  postEmployeeBodySchema,
  editEmployeeBodySchema,
  postEmployeeDepartmentBodySchema,
} = require('../validation/joiRequestValidation');

const router = express.Router();

// GET => /employees
router.get('/', empController.getAllEmployees);

// GET => /employees/id
router.get('/:id', validate(idParamsSchema), empController.getEmployee);

// POST => /employees
router.post('/', validate(postEmployeeBodySchema), authorize, empController.postEmployee);

// PUT => /employees/id
router.put('/:id', validate(editEmployeeBodySchema), empController.editEmployee);

// DELETE => /employees/id
router.delete('/:id', empController.deleteEmployee);

// GET => /employees/id/departments
router.get('/:id/departments', empController.getEmployeeDepartments);

// POST => /employees/id/departments
router.post('/:id/departments', validate(postEmployeeDepartmentBodySchema), empController.postEmployeeDepartment);

module.exports = router;
