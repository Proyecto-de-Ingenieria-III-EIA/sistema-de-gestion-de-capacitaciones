import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { setupTestData, cleanupTestData } from './setup';
import { Context } from '@/types';
import { prisma } from '@/prisma';
import { queries } from '../users/queries';

let context: Context;

beforeAll(async () => {
  context = {
    db: prisma,
    authData: { id: 'user456', email: 'test@example.com', role: 'ADMIN', expires: new Date() },
  };

  await setupTestData(context);
});

afterAll(async () => {
  await cleanupTestData(context);
});

describe('User Queries', () => {
  it('should fetch all users', async () => {
    const users = await context.db.user.findMany();
    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThan(0);
  });

  it('should fetch user by ID', async () => {
    const user = await context.db.user.findUnique({
      where: { id: 'user123' },
    });
    expect(user).toBeDefined();
    expect(user?.email).toBe('john@example.com');
  });
});

describe('User Mutations', () => {
  it('should update a user', async () => {
    const updatedUser = await context.db.user.update({
      where: { id: 'user123' },
      data: { name: 'Updated Name' },
    });
    expect(updatedUser).toBeDefined();
    expect(updatedUser.name).toBe('Updated Name');
  });

  it('should assign a training to a user', async () => {
    const assignedUser = await context.db.user.update({
      where: { id: 'user123' },
      data: {
        trainings: {
          connect: { id: 'training123' },
        },
      },
      include: { trainings: true },
    });

    expect(assignedUser).toBeDefined();
    expect(assignedUser.trainings.length).toBeGreaterThan(0);
    expect(assignedUser.trainings.some(t => t.id === 'training123')).toBe(true);
  })

  //el usuario está inscrito a 2 pero debería solo mostrar el aprobado
  it('should return only approved trainings for a user', async () => {
    const trainings = await queries.getUserTrainings(
      null,
      {}, 
      context
    );

    expect(trainings).toBeInstanceOf(Array);
    expect(trainings.length).toBe(1);
    expect(trainings[0].id).toBe('public-training');
  })

  

  it('should delete an existing user', async () => {
    const deletedUser = await context.db.user.delete({
      where: { id: 'user123' },
    });
    expect(deletedUser).toBeDefined();

    // Verify that querying the deleted user returns null
    const user = await context.db.user.findUnique({
      where: { id: 'user123' },
    });
    expect(user).toBeNull();
  });
});
