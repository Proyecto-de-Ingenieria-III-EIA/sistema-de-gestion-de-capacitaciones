import { gql } from '@apollo/client';

export const GET_ENROLLMENTS = gql`
  query GetEnrollmentsByTraining($trainingId: String!) {
    getEnrollmentsByTraining(trainingId: $trainingId) {
      id
      progress
      status
      user {
        id
        name
        email
        area
      }
    }
  }
`;

export const GET_AVAILABLE_USERS_FOR_TRAINING = gql`
  query GetAvailableUsersForTraining($trainingId: String!) {
    getAvailableUsersForTraining(trainingId: $trainingId) {
      id
      name
      email
      area
    }
  }
`;

export const SUBSCRIBE_TO_TRAINING_USER = gql`
  mutation SubscribeToTraining($trainingId: String!) {
    subscribeToTraining(trainingId: $trainingId) {
      id
      status
      user {
        id
        name
      }
      training {
        id
        title
      }
    }
  }
`;

export const SUBSCRIBE_TO_TRAINING_ADMIN = gql`
  mutation SubscribeToTraining($trainingId: String!, $userId: String!) {
    subscribeToTraining(trainingId: $trainingId, userId: $userId) {
      id
      status
      user {
        id
        name
      }
      training {
        id
        title
      }
    }
  }
`;

export const ENROLL_TO_PUBLIC_TRAINING = gql`
  mutation EnrollToPublicTraining($trainingId: String!) {
    enrollToPublicTraining(trainingId: $trainingId) {
      id
      status
      training {
        id
        title
      }
      user {
        id
        name
      }
    }
  }
`;

export const DELETE_ENROLLMENT = gql`
  mutation DeleteEnrollment($id: String!) {
    deleteEnrollment(id: $id) {
      id
    }
  }
`;
