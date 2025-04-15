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