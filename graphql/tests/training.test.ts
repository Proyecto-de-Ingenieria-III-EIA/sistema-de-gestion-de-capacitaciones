import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { ApolloServer } from '@apollo/server';
import { resolvers, types as typeDefs } from '../index';
import { setupTestData, cleanupTestData } from './setup';

let server: ApolloServer;

beforeAll(async () => {
  server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  await setupTestData();
});

afterAll(async () => {
  await cleanupTestData();
});

describe('Training Queries', () => {
  it('should fetch all trainings', async () => {
    const query = `
      query {
        getTrainings {
          id
          title
          description
        }
      }
    `;
    const response = await server.executeOperation({ query });
    expect(
      response.body.kind === 'single' &&
        response.body.singleResult?.data?.getTrainings
    ).toBeDefined();
  });

  it('should fetch a training by ID', async () => {
    const query = `
      query {
        getTrainingById(id: "training123") {
          id
          title
          description
        }
      }
    `;
    const response = await server.executeOperation({ query });
    expect(
      response.body.kind === 'single' &&
        (response.body.singleResult?.data?.getTrainingById as { title: string })
          .title
    ).toBe('AI Fundamentals');
  });
});

describe('Training Mutations', () => {
  it('should create a new training', async () => {
    const mutation = `
      mutation createTraining($title: String!, $description: String, $instructorId: String!) {
        createTraining(title: $title, description: $description, instructorId: $instructorId) {
          id
          title
          description
          instructor {
            id
          }
        }
      }
    `;
    const response = await server.executeOperation({
      query: mutation,
      variables: {
        title: 'ML Basics',
        description: 'Intro to ML',
        instructorId: 'instructor123',
      },
    });

    expect(
      response.body.kind === 'single' &&
        (response.body.singleResult?.data?.createTraining as { title: string })
          .title
    ).toBe('ML Basics');
  });

  it('should delete a training', async () => {
    const mutation = `
      mutation deleteTraining($id: String!) {
        deleteTraining(id: $id)
      }
    `;
    const response = await server.executeOperation({
      query: mutation,
      variables: { id: 'training123' },
    });

    expect(
      response.body.kind === 'single' &&
        response.body.singleResult?.data?.deleteTraining
    ).toBe(true);
  });
});
