import gql from 'graphql-tag';

export const enrollmentTypes = gql`
  scalar DateTime
  ## Enrollment Model
  type Enrollment {
    id: String!
    user: User!
    training: Training!
    status: EnrollmentStatus!
    createdAt: DateTime
    updatedAt: DateTime
  }

  enum EnrollmentStatus {
    PENDING
    APPROVED
    REJECTED
  }

  ## Queries
  type Query {
    # Enrollments
    getEnrollments: [Enrollment]
    getEnrollmentsByUser(userId: String!): [Enrollment]
  }

  ## Mutations
  type Mutation {
    # Enrollment mutations
    subscribeToTraining(trainingId: String!): Enrollment

    updateEnrollmentStatus(id: String!, status: EnrollmentStatus!): Enrollment
  }
`;
