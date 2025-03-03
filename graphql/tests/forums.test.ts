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

describe('Forum Queries', () => {
  it('should fetch all forum posts', async () => {
    const query = `
      query {
        getForumPosts {
          id
          title
          content
        }
      }
    `;
    const response = await server.executeOperation({ query });
    expect(
      response.body.kind === 'single' &&
        response.body.singleResult?.data?.getForumPosts
    ).toBeDefined();
  });

  it('should fetch a forum post by ID', async () => {
    const query = `
      query getForumPostById($id: String!) {
        getForumPostById(id: $id) {
          title
          content
        }
      }
    `;
    const response = await server.executeOperation({
      query,
      variables: { id: 'forum123' }, // Use a forum post created in setupTestData
    });

    expect(
      response.body.kind === 'single' &&
        (
          response.body.singleResult?.data?.getForumPostById as {
            title: string;
          }
        ).title
    ).toBe('Sample Forum Post');
  });
});

describe('Forum Mutations', () => {
  let createdForumId: string;

  it('should create a forum post', async () => {
    const mutation = `
      mutation createForumPost($title: String!, $content: String!, $userId: String!, $trainingId: String!) {
        createForumPost(title: $title, content: $content, userId: $userId, trainingId: $trainingId) {
          id
          title
          content
        }
      }
    `;
    const response = await server.executeOperation({
      query: mutation,
      variables: {
        title: 'New Forum Post',
        content: 'This is a test forum post.',
        userId: 'user123', // Pre-created user from setupTestData
        trainingId: 'training123', // Pre-created training from setupTestData
      },
    });

    expect(
      response.body.kind === 'single' &&
        (response.body.singleResult?.data?.createForumPost as { title: string })
          .title
    ).toBe('New Forum Post');

    if (response.body.kind === 'single') {
      createdForumId = (
        response.body.singleResult?.data?.createForumPost as { id: string }
      ).id;
    } else {
      throw new Error('Unexpected response kind');
    }
  });

  it('should update a forum post', async () => {
    const mutation = `
      mutation updateForumPost($id: String!, $title: String, $content: String) {
        updateForumPost(id: $id, title: $title, content: $content) {
          title
          content
        }
      }
    `;
    const response = await server.executeOperation({
      query: mutation,
      variables: {
        id: createdForumId,
        title: 'Updated Forum Title',
        content: 'Updated content.',
      },
    });

    expect(
      response.body.kind === 'single' &&
        (response.body.singleResult?.data?.updateForumPost as { title: string })
          .title
    ).toBe('Updated Forum Title');
  });

  it('should delete a forum post', async () => {
    const mutation = `
      mutation deleteForumPost($id: String!) {
        deleteForumPost(id: $id)
      }
    `;
    const response = await server.executeOperation({
      query: mutation,
      variables: { id: createdForumId },
    });

    expect(
      response.body.kind === 'single' &&
        response.body.singleResult?.data?.deleteForumPost
    ).toBe(true);

    // Verify deletion
    const query = `
      query getForumPostById($id: String!) {
        getForumPostById(id: $id) {
          id
        }
      }
    `;
    const queryResponse = await server.executeOperation({
      query,
      variables: { id: createdForumId },
    });

    expect(
      queryResponse.body.kind === 'single' &&
        queryResponse.body.singleResult?.data?.getForumPostById
    ).toBeNull();
  });

  it('should create a comment on a forum post', async () => {
    const mutation = `
      mutation createComment($content: String!, $userId: String!, $forumPostId: String!) {
        createComment(content: $content, userId: $userId, forumPostId: $forumPostId) {
          id
          content
        }
      }
    `;
    const response = await server.executeOperation({
      query: mutation,
      variables: {
        content: 'This is a test comment.',
        userId: 'user123', // Pre-created user
        forumPostId: 'forum123', // Pre-created forum post
      },
    });

    expect(
      response.body.kind === 'single' &&
        (response.body.singleResult?.data?.createComment as { content: string })
          .content
    ).toBe('This is a test comment.');
  });

  it('should delete a comment', async () => {
    const mutation = `
      mutation deleteComment($id: String!) {
        deleteComment(id: $id)
      }
    `;
    const response = await server.executeOperation({
      query: mutation,
      variables: { id: 'comment123' }, // Pre-created comment in setupTestData
    });

    expect(
      response.body.kind === 'single' &&
        response.body.singleResult?.data?.deleteComment
    ).toBe(true);
  });
});
