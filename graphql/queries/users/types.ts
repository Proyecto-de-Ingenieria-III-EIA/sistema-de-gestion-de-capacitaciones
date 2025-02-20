import gql from 'graphql-tag';

const userTypes = gql`
  type Query {
    users: [User!]!
  }

  type User {
    name: String
    username: String
  }
`;

export { userTypes };
