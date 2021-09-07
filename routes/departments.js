const express = require('express');
const validate = require('express-validation');
const depController = require('../controller/departments');
const { postDepartmentBodySchema, editDepartmentBodySchema } = require('../validation/joiRequestValidation');

const router = express.Router();

// GET => /departments
router.get('/', depController.getAllDepartments);

// GET => /departments/id
router.get('/:id', depController.getDepartment);

// POST => /departments
router.post('/', validate(postDepartmentBodySchema), depController.postDepartment);

// PUT => /departments/id
router.put('/:id', validate(editDepartmentBodySchema), depController.editDepartment);

// DELETE => /departments/id
router.delete('/:id', depController.deleteDepartment);

module.exports = router;
