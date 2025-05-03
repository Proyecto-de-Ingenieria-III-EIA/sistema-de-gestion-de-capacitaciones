import { gql } from "@apollo/client";

export const DELETE_SESSION = gql`
  mutation DeleteSession($sessionToken: String!) {
    deleteSession(sessionToken: $sessionToken)
  }
`;