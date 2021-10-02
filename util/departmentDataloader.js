const EmpDept = require('../models/employeeDepartment');
const { Op } = require('sequelize');
const Employee = require('../models/employees');

const batchGetEmployeeOfDepartmentsById = async (departmentIds) => {
  // I return a map of [DepartmentId]: DepartmentEmployeeDetails
  const employeeOfDepartments = await EmpDept.findAll({
    where: { deptId: { [Op.in]: departmentIds } },
    include: Employee,
  });

  const employeeOfDepartmentsMap = departmentIds.map((departmentId) => {
    return employeeOfDepartments.filter((department) => department.deptId === departmentId);
  });
  return employeeOfDepartmentsMap;
};

module.exports = batchGetEmployeeOfDepartmentsById;
