const graphql = require('graphql');
const Employee = require('../type/Employee');

const employees = [
    {
      name: 'Janet Terry',
      username: 'Giovanny.Schroeder',
      password: '$2a$10$un48JbMk1txjgTiwW3LtUOPICXhldCgRLy9XrdjwWCGmrhCfBXLEy',
      age: 10,
      isActive: true,
    },
  ];

const schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
        name: 'Query',
        fields: {
            getEmployees: {
                type: new graphql.GraphQLList(Employee),
                args: {},
                resolve: (_, {}) => employees,
            },
        },
    }),
});

module.exports = schema;