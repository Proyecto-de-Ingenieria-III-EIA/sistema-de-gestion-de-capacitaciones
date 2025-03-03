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

describe('User Queries', () => {
  it('should fetch all users', async () => {
    const query = `
      query {
        getUsers {
          id
          name
          email
        }
      }
    `;
    const response = await server.executeOperation({ query });
    expect(
      response.body.kind === 'single' &&
        response.body.singleResult?.data?.getUsers
    ).toBeDefined();
  });

  it('should fetch user by ID', async () => {
    const query = `
      query {
        getUserById(id: "user123") {
          name
          email
        }
      }
    `;
    const response = await server.executeOperation({ query });
    expect(
      response.body.kind === 'single' &&
        (response.body.singleResult?.data?.getUserById as { email: string })
          .email
    ).toBe('john@example.com');
  });
});

describe('User Mutations', () => {
  it('should update a user', async () => {
    const mutation = `
      mutation updateUser($id: String!, $name: String!) {
        updateUser(id: $id, name: $name) {
          name
        }
      }
    `;
    const response = await server.executeOperation({
      query: mutation,
      variables: { id: 'user123', name: 'Updated Name' },
    });

    expect(
      response.body.kind === 'single' &&
        (response.body.singleResult?.data?.updateUser as { name: string }).name
    ).toBe('Updated Name');
  });

  it('should delete an existing user', async () => {
    const mutation = `
      mutation deleteUser($id: String!) {
        deleteUser(id: $id)
      }
    `;

    const response = await server.executeOperation({
      query: mutation,
      variables: { id: 'user123' }, // Use the pre-created user from setupTestData
    });

    expect(
      response.body.kind === 'single' &&
        response.body.singleResult?.data?.deleteUser
    ).toBe(true);

    // Verify that querying the deleted user returns null
    const query = `
      query getUserById($id: String!) {
        getUserById(id: $id) {
          id
        }
      }
    `;

    const queryResponse = await server.executeOperation({
      query,
      variables: { id: 'user123' },
    });

    expect(
      queryResponse.body.kind === 'single' &&
        queryResponse.body.singleResult?.data?.getUserById
    ).toBeNull();
  });
});
