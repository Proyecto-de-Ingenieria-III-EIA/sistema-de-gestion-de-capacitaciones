import { gql } from "@apollo/client";

export const GET_ASSESSMENTS = gql`
    query GetAssessments($trainingId: String!) {
        getAssessments(trainingId: $trainingId) {
            id
            title
            questions {
                id
                question
                options
                answer
            }
            createdAt
            updatedAt
        }
    }
`;

export const GET_ASSESSMENT_RESULTS = gql`
    query GetAssessmentResults($assessmentId: String!) {
        getAssessmentResults(assessmentId: $assessmentId) {
            id
            user {
            id
            name
            email
            }
            score
            createdAt
        }
    }
`;

export const GET_ASSESSMENT_BY_ID = gql`
    query GetAssessmentById($assessmentId: String!) {
        getAssessmentById(assessmentId: $assessmentId) {
            id
            title
            training{
                id
            }
            questions {
                id
                question
                options
                answer
            }
            createdAt
            updatedAt
        }
    }
`;

export const GET_ASSESSMENT_RESULTS_BY_USER = gql`
  query GetAssessmentResultsByUser($userId: String!, $trainingId: String!) {
    getAssessmentResultsByUser(userId: $userId, trainingId: $trainingId) {
      id
      assessment {
        id
        title
      }
      score
      createdAt
    }
  }
`;

export const CREATE_ASSESSMENT = gql`
    mutation CreateAssessment($trainingId: String!, $title: String!) {
        createAssessment(trainingId: $trainingId, title: $title) {
            id
            title
        }
    }
`;

export const DELETE_ASSESSMENT = gql`
    mutation DeleteAssessment($assessmentId: String!) {
        deleteAssessment(assessmentId: $assessmentId) {
            id
        }
    }
`;

export const ADD_QUESTION = gql`
    mutation AddQuestion($assessmentId: String!, $question: String!, $options: [String!]!, $answer: String!) {
        addQuestion(assessmentId: $assessmentId, question: $question, options: $options, answer: $answer) {
            id
            question
            options
            answer
        }
    }
`;

export const EDIT_QUESTION = gql`
    mutation EditQuestion($questionId: String!, $question: String, $options: [String!], $answer: String) {
        editQuestion(questionId: $questionId, question: $question, options: $options, answer: $answer) {
            id
            question
            options
            answer
        }
    }
`;

export const DELETE_QUESTION = gql`
    mutation DeleteQuestion($questionId: String!) {
        deleteQuestion(questionId: $questionId) {
            id
        }
    }
`;

export const GET_ASSESSMENT_METRICS = gql`
query GetAssessmentMetrics($assessmentId: String!) {
  getAssessmentMetrics(assessmentId: $assessmentId) {
    meanScore
    maxScore
    minScore
  }
}
`;

export const SUBMIT_ASSESSMENT_RESULT = gql`
  mutation SubmitAssessmentResult(
    $assessmentId: String!
    $userId: String!
    $answers: [AnswerInput!]!
  ) {
    submitAssessmentResult(
      assessmentId: $assessmentId
      userId: $userId
      answers: $answers
    ) {
      id
      score
      createdAt
    }
  }
`;