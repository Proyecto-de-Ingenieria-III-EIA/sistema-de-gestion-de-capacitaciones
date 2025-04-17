import { gql } from '@apollo/client';

export const GET_INSTRUCTORS = gql`
  query getInstructors {
    getInstructors {
      id
      name
      email
      image
      area
      phone
      role {
        id
        name
      }
    }
  }
`;

export const GET_USERS = gql`
  query getUsers {
    getUsers {
      id
      name
      email
      image
      area
      phone
      role {
        id
        name
      }
    }
  }
`;

export const GET_USER_PROGRESS = gql`
  query getUserProgress {
    getUserProgress {
      userId
      totalTrainings
      completedTrainings
      completionRate
    }
  }
`;


export const GET_ASSESSMENT_PROGRESS_BY_TRAINING = gql`
  query GetUserAssessmentProgressInTraining($userId: String!, $trainingId: String!) {
    getUserAssessmentProgressInTraining(userId: $userId, trainingId: $trainingId) {
      totalAssessments
      completedAssessments
      passedAssessments
      progress
    }
  }
`;

