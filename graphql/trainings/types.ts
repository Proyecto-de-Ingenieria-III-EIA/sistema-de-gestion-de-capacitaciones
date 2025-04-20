import gql from 'graphql-tag';

export const trainingTypes = gql`
  scalar DateTime

  ## Training
  type Training {
    id: String!
    title: String!
    description: String!
    isHidden: Boolean!
    isPublic: Boolean!
    imageSrc: String
    materials: [TrainingMaterial]
    assessments: [Assessment]
    enrollments: [Enrollment]
    forumPosts: [ForumPost]
    instructor: User!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  ## Training Material
  type TrainingMaterial {
    id: String!
    training: Training!
    fileType: String!
    fileUrl: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  ## Queries
  type Query {
    getTrainingMaterials(trainingId: String!): [TrainingMaterial]
    getTrainings: [Training]
    getTrainingById(trainingId: String!): Training
    getTrainingsByUser(userId: String!): [Training]
  }

  ## Mutations
  type Mutation {
    # Training material mutations
    createTrainingMaterial(
      trainingId: String!
      fileType: String!
      fileUrl: String!
    ): TrainingMaterial

    updateTrainingMaterial(
      id: String!
      fileType: String
      fileUrl: String
    ): TrainingMaterial

    deleteTrainingMaterial(id: String!): TrainingMaterial

    # Training mutations
    createTraining(
      title: String!
      description: String
      instructorId: String!
    ): Training

    updateTraining(
      id: String!
      title: String
      description: String
      instructorId: String
      isHidden: Boolean
      isPublic: Boolean
    ): Training

    deleteTraining(id: String!): Training

    assignInstructorToTraining(
      trainingId: String!
      instructorId: String!
    ): Training

    toggleTrainingVisibility(trainingId: String!): Training

    duplicateTraining(trainingId: String!): Training
  }
`;