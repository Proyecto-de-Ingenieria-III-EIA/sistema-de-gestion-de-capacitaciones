import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { setupTestData, cleanupTestData } from './setup';
import { Context } from '@/types';
import { prisma } from '@/prisma';

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

describe('Setup and Cleanup', () => {
  it('should set up test data', async () => {
    const users = await context.db.user.findMany();
    const trainings = await context.db.training.findMany();
    const forumPosts = await context.db.forumPost.findMany();
    const comments = await context.db.comment.findMany();

    expect(users.length).toBeGreaterThan(0);
    expect(trainings.length).toBeGreaterThan(0);
    expect(forumPosts.length).toBeGreaterThan(0);
    expect(comments.length).toBeGreaterThan(0);
  });

  it('should clean up test data', async () => {
    await cleanupTestData(context);

    const users = await context.db.user.findMany();
    const trainings = await context.db.training.findMany();
    const forumPosts = await context.db.forumPost.findMany();
    const comments = await context.db.comment.findMany();

    expect(users.length).toBe(0);
    expect(trainings.length).toBe(0);
    expect(forumPosts.length).toBe(0);
    expect(comments.length).toBe(0);
  });
});
