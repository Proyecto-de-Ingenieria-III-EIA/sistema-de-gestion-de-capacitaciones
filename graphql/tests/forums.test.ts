import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { setupTestData, cleanupTestData } from './setup';
import { prisma } from '@/prisma';
import { Context } from '@/types';

let context: Context;

beforeAll(async () => {
  context = {
    db: prisma,
    authData: { email: 'test@example.com', role: 'ADMIN', expires: new Date() },
  };

  await setupTestData(context);
});

afterAll(async () => {
  await cleanupTestData(context);
});

describe('Forum Queries', () => {
  it('should fetch all forum posts', async () => {
    const forumPosts = await context.db.forumPost.findMany();
    expect(forumPosts).toBeDefined();
    expect(forumPosts.length).toBeGreaterThan(0);
  });

  it('should fetch a forum post by ID', async () => {
    const forumPost = await context.db.forumPost.findUnique({
      where: { id: 'forum123' },
    });
    expect(forumPost).toBeDefined();
    expect(forumPost?.title).toBe('Sample Forum Post');
  });
});

describe('Forum Mutations', () => {
  let createdForumId: string;

  it('should create a forum post', async () => {
    const newForumPost = await context.db.forumPost.create({
      data: {
        title: 'New Forum Post',
        content: 'This is a test forum post.',
        userId: 'user123', // Pre-created user from setupTestData
        trainingId: 'training123', // Pre-created training from setupTestData
      },
    });

    expect(newForumPost).toBeDefined();
    expect(newForumPost.title).toBe('New Forum Post');
    createdForumId = newForumPost.id;
  });

  it('should update a forum post', async () => {
    const updatedForumPost = await context.db.forumPost.update({
      where: { id: createdForumId },
      data: {
        title: 'Updated Forum Title',
        content: 'Updated content.',
      },
    });

    expect(updatedForumPost).toBeDefined();
    expect(updatedForumPost.title).toBe('Updated Forum Title');
  });

  it('should delete a forum post', async () => {
    const deletedForumPost = await context.db.forumPost.delete({
      where: { id: createdForumId },
    });

    expect(deletedForumPost).toBeDefined();

    // Verify deletion
    const forumPost = await context.db.forumPost.findUnique({
      where: { id: createdForumId },
    });
    expect(forumPost).toBeNull();
  });

  it('should create a comment on a forum post', async () => {
    const newComment = await context.db.comment.create({
      data: {
        content: 'This is a test comment.',
        userId: 'user123', // Pre-created user
        forumPostId: 'forum123', // Pre-created forum post
      },
    });

    expect(newComment).toBeDefined();
    expect(newComment.content).toBe('This is a test comment.');
  });

  it('should delete a comment', async () => {
    const deletedComment = await context.db.comment.delete({
      where: { id: 'comment123' }, // Pre-created comment in setupTestData
    });

    expect(deletedComment).toBeDefined();
  });
});
