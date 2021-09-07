const employees = [
  {
    name: 'Janet Terry',
    username: 'Giovanny.Schroeder',
    password: '$2a$10$un48JbMk1txjgTiwW3LtUOPICXhldCgRLy9XrdjwWCGmrhCfBXLEy',
    age: 10,
    isActive: true,
  },
];

const resolvers = {
  Query: {
    getEmployees() {
      return employees;
    },
  },
};

module.exports = resolvers;
