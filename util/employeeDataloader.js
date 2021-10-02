const EmpDept = require('../models/employeeDepartment');
const { Op } = require('sequelize');
const Department = require('../models/departments');

const batchGetDepartmentOfEmployeesById = async (employeeIds) => {
  // I return a map of [EmployeeId]: EmployeeDepartmentDetails
  const departmentsOfEmployees = await EmpDept.findAll({
    where: { empId: { [Op.in]: employeeIds } },
    include: Department,
  });

  const departmentsOfEmployeesMap = employeeIds.map((employeeId) => {
    return departmentsOfEmployees.filter((employee) => employee.empId === employeeId);
  });
  return departmentsOfEmployeesMap;
};

module.exports = batchGetDepartmentOfEmployeesById;
