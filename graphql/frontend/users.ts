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