import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { setupTestData, cleanupTestData } from './setup';
import { prisma } from '@/prisma';
import { Context } from '@/types';
import { mutations } from '../enrollments/mutations';

let context: Context;
let userId: string;
let publicTrainingId: string;
let privateTrainingId: string;

beforeAll(async () => {
  context = {
    db: prisma,
    authData: { email: 'test@example.com', id: 'user123', role: 'USER', expires: new Date() },
  };

  await setupTestData(context);

  const publicTraining = await context.db.training.create({
    data: {
      id: 'public-training',
      title: 'Public Training',
      description: 'Accessible to everyone',
      isPublic: true,
      instructorId: 'instructor123',
    },
  });

  const privateTraining = await context.db.training.create({
    data: {
      id: 'private-training',
      title: 'Private Training',
      description: 'Requires approval',
      isPublic: false,
      instructorId: 'instructor123',
    },
  });

  publicTrainingId = publicTraining.id;
  privateTrainingId = privateTraining.id;
  userId = 'user123';
});

afterAll(async () => {
  await cleanupTestData(context);
});

describe('Enrollment Mutations', () => {
  it('should enroll a user in a public training and set status to APPROVED', async () => {
    const result = await mutations.subscribeToTraining(
      null,
      { trainingId: publicTrainingId },
      context
    );

    expect(result).toBeDefined();
    expect(result.trainingId).toBe(publicTrainingId);
    expect(result.userId).toBe(userId);
    expect(result.status).toBe('APPROVED');
  });

  it('should enroll a user in a private training and set status to PENDING', async () => {
    const result = await mutations.subscribeToTraining(
      null,
      { trainingId: privateTrainingId },
      context
    );

    expect(result).toBeDefined();
    expect(result.trainingId).toBe(privateTrainingId);
    expect(result.userId).toBe(userId);
    expect(result.status).toBe('PENDING');
  })

  it('should should throw an error if the user is already enrolled', async () => {
    await mutations.subscribeToTraining(
      null,
      { trainingId: publicTrainingId },
      context
    );

    await expect(
      mutations.subscribeToTraining(
        null,
        { trainingId: publicTrainingId },
        context
      )
    ).rejects.toThrowError(/Already erolled to this training/);
  });
});