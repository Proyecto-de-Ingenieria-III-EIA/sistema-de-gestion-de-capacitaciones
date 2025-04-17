import gql from 'graphql-tag';

export const assessmentTypes = gql`
  scalar DateTime

  ## Assessment
  type Assessment {
    id: String!
    training: Training!
    title: String!
    questions: [Question!]!
    assessmentResults: [AssessmentResult!]!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Question {
    id: String!
    assessment: Assessment!
    question: String!
    options: [String!]!
    answer: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type AssessmentResult {
    id: String!
    assessment: Assessment!
    user: User!
    score: Int!
    createdAt: DateTime
    updatedAt: DateTime
  }

  ## Queries
  type Query {
    getAssessments(trainingId: String!): [Assessment]
    getAssessmentResults(assessmentId: String!): [AssessmentResult]
    getAssessmentResultsByUser(userId: String!, trainingId: String!): [AssessmentResult]
  }

  ## Mutations
  type Mutation {
    createAssessment(trainingId: String!, title: String!): Assessment
    deleteAssessment(assessmentId: String!): Assessment
    addQuestion(
      assessmentId: String!
      question: String!
      options: [String!]!
      answer: String!
    ): Question
    editQuestion(
      questionId: String!
      question: String
      options: [String!]
      answer: String
    ): Question
    deleteQuestion(questionId: String!): Question
    submitAssessmentResult(
      assessmentId: String!
      userId: String!
      answers: [AnswerInput!]!
    ): AssessmentResult
  }

  ## Input Types
  input AnswerInput {
    questionId: String!
    selectedAnswer: String!
  }
`;