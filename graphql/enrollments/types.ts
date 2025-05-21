import gql from 'graphql-tag';

export const enrollmentTypes = gql`
  scalar DateTime
  ## Enrollment Model
  type Enrollment {
    id: String!
    user: User!
    training: Training!
    status: EnrollmentStatus!
    progress: ProgressStatus!
    createdAt: DateTime
    updatedAt: DateTime
  }

  enum EnrollmentStatus {
    PENDING
    APPROVED
    REJECTED
  }

  enum ProgressStatus {
    IN_PROGRESS
    COMPLETED
  }

  ## Queries
  type Query {
    # Enrollments
    getEnrollments: [Enrollment]
    getEnrollmentsByUser(userId: String!): [Enrollment]
    getParticipantsProgress: [ParticipantProgress!]!
    getUserProgress: UserProgress!
    getEnrollmentsByTraining(trainingId: String!): [Enrollment]
    getAvailableUsersForTraining(trainingId: String!): [User]
    getUserProgress: UserProgress!
  }

  ## Mutations
  type Mutation {
    # Enrollment mutations
    subscribeToTraining(trainingId: String!, userId: String): Enrollment
    updateEnrollmentStatus(id: String!, status: EnrollmentStatus!): Enrollment
    deleteEnrollment(id: String!): Enrollment
    enrollToPublicTraining(trainingId: String!): Enrollment!
  }

   type ParticipantProgress {
    userId: String!
    name: String!
    email: String!
    totalTrainings: Int!
    completedTrainings: Int!
    completionRate: Float!
  }

  type UserProgress {
  userId: String!
  totalTrainings: Int!
  completedTrainings: Int!
  completionRate: String!
}
`;
