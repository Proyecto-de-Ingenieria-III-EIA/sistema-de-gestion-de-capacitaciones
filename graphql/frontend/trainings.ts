import { gql } from '@apollo/client';

export const GET_TRAININGS_BY_USER = gql`
  query GetTrainingsByUser($userId: String!) {
    getTrainingsByUser(userId: $userId) {
      id
      title
      description
      isHidden
      isPublic
      imageSrc
    }
  }
`;

export const GET_TRAININGS = gql`
  query GetTrainings {
    getTrainings {
      id
      title
      description
      isHidden
      isPublic
      imageSrc
      instructor {
        id
        name
      }
    }
  }
`;

export const CREATE_TRAINING = gql`
mutation createTraining($title: String!, $description: String!, $instructorId: String!) {
  createTraining(title: $title, description: $description, instructorId: $instructorId) {
    id
    title
    description
    isHidden
    isPublic
    imageSrc
    updatedAt
    createdAt
    instructor {
      id
      name
    }
  }
}
`;