import { gql } from '@apollo/client';
import { Command as CommandPrimitive } from 'cmdk';

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
      createdAt
      updatedAt
      instructor {
        id
        name
        email
      }
      materials {
        id
        fileType
        fileUrl
      }
      assessments {
        id
        title
        questions {
          id
          question
          options
          answer
        }
      }
      enrollments {
        id
        status
        progress
        user {
          id
          name
          email
          area
        }
      }
    }
  }
`;

export const GET_PUBLIC_TRAININGS = gql`
  query GetPublicTrainingsData {
    getPublicTrainings {
      id
      title
      description
      isPublic
      imageSrc
      instructor {
        id
        name
      }
      materials {
        id
        fileUrl
      }
      assessments {
        id
        questions {
          id
        }
      }
    }
  }
`;

export const GET_TRAININGS_BY_INSTRUCTOR = gql`
  query GetTrainingsByInstructor($instructorId: String!) {
    getTrainingsByInstructor(instructorId: $instructorId) {
      id
      title
      description
      isHidden
      isPublic
      imageSrc
      createdAt
      updatedAt
      instructor {
        id
        name
        email
      }
      materials {
        id
        fileType
        fileUrl
      }
      assessments {
        id
        title
        questions {
          id
          question
          options
          answer
        }
      }
      enrollments {
        id
        status
        progress
        user {
          id
          name
          email
          area
        }
      }
    }
  }
`;

export const GET_TRAINING_BY_ID = gql`
  query GetTrainingById($trainingId: String!) {
    getTrainingById(trainingId: $trainingId) {
      id
      title
      description
      isHidden
      isPublic
      imageSrc
      createdAt
      updatedAt
      instructor {
        id
        name
        email
      }
      assessments {
        id
      }
      enrollments {
        id
        status
        progress
      }
    }
  }
`;

export const CREATE_TRAINING = gql`
  mutation createTraining(
    $title: String!
    $description: String!
    $instructorId: String!
  ) {
    createTraining(
      title: $title
      description: $description
      instructorId: $instructorId
    ) {
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

export const UPDATE_TRAINING = gql`
  mutation UpdateTraining(
    $id: String!
    $title: String
    $description: String
    $instructorId: String
    $isHidden: Boolean
    $isPublic: Boolean
    $imageSrc: String
  ) {
    updateTraining(
      id: $id
      title: $title
      description: $description
      instructorId: $instructorId
      isHidden: $isHidden
      isPublic: $isPublic
      imageSrc: $imageSrc
    ) {
      id
      title
      description
      instructor {
        id
        name
      }
      isHidden
      isPublic
      imageSrc
    }
  }
`;

export const DELETE_TRAINING = gql`
  mutation deleteTraining($id: String!) {
    deleteTraining(id: $id) {
      id
    }
  }
`;

export const GET_TRAINING_MATERIALS = gql`
  query GetTrainingMaterials($trainingId: String!) {
    getTrainingMaterials(trainingId: $trainingId) {
      id
      fileType
      fileUrl
      createdAt
    }
  }
`;

export const ADD_TRAINING_MATERIAL = gql`
  mutation addTrainingMaterial(
    $trainingId: String!
    $fileType: String!
    $fileUrl: String!
  ) {
    createTrainingMaterial(
      trainingId: $trainingId
      fileType: $fileType
      fileUrl: $fileUrl
    ) {
      id
      training {
        id
        title
      }
      fileType
      fileUrl
    }
  }
`;

export const DELETE_TRAINING_MATERIAL = gql`
  mutation DeleteTrainingMaterial($id: String!) {
    deleteTrainingMaterial(id: $id) {
      id
    }
  }
`;

export const DUPLICATE_TRAINING = gql`
  mutation DuplicateTraining($trainingId: String!) {
    duplicateTraining(trainingId: $trainingId) {
      id
      title
      description
      isHidden
      isPublic
      instructor {
        id
        name
      }
      materials {
        id
        fileType
        fileUrl
      }
      assessments {
        id
        title
        questions {
          id
          question
          options
          answer
        }
      }
    }
  }
`;
