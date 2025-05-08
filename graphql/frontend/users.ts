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
  query GetUserAssessmentProgressInTraining(
    $userId: String!
    $trainingId: String!
  ) {
    getUserAssessmentProgressInTraining(
      userId: $userId
      trainingId: $trainingId
    ) {
      totalAssessments
      passedAssessments
      progress
    }
  }
`;

export const GET_PROGRESS_IN_TRAININGS = gql`
  query GetUserProgressForTrainings($userId: String!) {
    getUserProgressForTrainings(userId: $userId) {
      trainingId
      trainingTitle
  query GetUserAssessmentProgressInTraining(
    $userId: String!
    $trainingId: String!
  ) {
    getUserAssessmentProgressInTraining(
      userId: $userId
      trainingId: $trainingId
    ) {
      totalAssessments
      passedAssessments
      progress
    }
  }
`;

export const GET_PROGRESS_IN_TRAININGS = gql`
  query GetUserProgressForTrainings($userId: String!) {
    getUserProgressForTrainings(userId: $userId) {
      trainingId
      trainingTitle
      totalAssessments
      passedAssessments
      progress
    }
  }
`;


export const UPDATE_USER = gql`
  mutation updateUser(
    $id: String!
    $name: String
    $phone: String
    $area: String
    $image: String
  ) {
    updateUser(id: $id, name: $name, phone: $phone, area: $area, image: $image) {
      id
      name
      phone
      area
      image
    }
  }
`;

export const UPDATE_USERS = gql`
  mutation UpdateUsers($users: [UpdateUserInput!]!) {
    updateUsers(users: $users) {
      id
      name
      area
      role {
        id
        name
      }
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($id: String!) {
    getUserById(id: $id) {
      id
      name
      email
      phone
      area
      role {
        name
      }
      createdAt
      updatedAt
      enrollments {
        id
        training {
          id
          title
        }
      }
    }
  }
`;
