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