const Department = require('../models/departments');

exports.getAllDepartments = (req, resp, next) => {
  Department.findAll()
    .then((departments) => {
      resp.status(200).json({
        message: 'Departments retrieved successfully',
        departments,
      });
    })
    .catch((err) => {
      console.log(err);
      resp.status(404).json({
        message: 'Departments not found',
      });
    });
};

exports.getDepartment = (req, resp, next) => {
  const id = req.params.id;

  Department.findByPk(id)
    .then((department) => {
      resp.status(200).json({
        message: 'Department retrieved successfully',
        department,
      });
    })
    .catch((err) => {
      console.log(err);
      resp.status(404).json({
        message: 'Department not found',
      });
    });
};

exports.postDepartment = (req, resp, next) => {
  const name = req.body.name;

  Department.create({
    name: name,
  })
    .then((department) => {
      resp.status(200).json({
        message: 'Department created successfully!',
        department,
      });
    })
    .catch((err) => {
      console.log(err);
      resp.status(404).json({
        message: 'Department creation failed',
      });
    });
};

exports.editDepartment = (req, resp, next) => {
  const id = req.params.id;
  const name = req.body.name;

  Department.findByPk(id)
    .then((department) => {
      department.name = name;
      return department.save();
    })
    .then((department) => {
      resp.status(200).json({
        message: 'Department updated successfully',
        department,
      });
    })
    .catch((err) => {
      console.log(err);
      resp.status(404).json({
        message: 'Department updation failed',
      });
    });
};

exports.deleteDepartment = (req, resp, next) => {
  const id = req.params.id;

  Department.findByPk(id)
    .then((department) => {
      return department.destroy();
    })
    .then(() => {
      resp.status(200).json({
        message: 'Department deleted successfully',
      });
    })
    .catch((err) => {
      console.log(err);
      resp.status(404).json({
        message: 'Department deletion failed',
      });
    });
};
