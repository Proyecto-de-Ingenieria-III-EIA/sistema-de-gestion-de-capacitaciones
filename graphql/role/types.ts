import gql from 'graphql-tag';

const roleTypes = gql`
  enum Enum_RoleName {
    ADMIN
    INSTRUCTOR
    USER
  }

  type Role {
    id: ID
    name: Enum_RoleName
    users: [User]
    createdAt: DateTime
    updatedAt: DateTime
  }

  ## Queries
  type Query {
    # Roles
    getRoles: [Role]
  }

  ## Mutations
  type Mutation {
    updateUserRole(id: String!, roleName: Enum_RoleName!): User
  }
`;

export { roleTypes };
