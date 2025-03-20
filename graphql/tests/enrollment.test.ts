import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { setupTestData, cleanupTestData } from './setup';
import { prisma } from '@/prisma';
import { Context } from '@/types';
import { mutations } from '../enrollments/mutations';

let context: Context;


beforeEach(async () => {
  context = {
    db: prisma,
    authData: { email: 'test@example.com', id: 'user123', role: 'USER', expires: new Date() },
  };

  await setupTestData(context);
  console.log("🛠️ Running setupTestData...");
});

afterEach(async () => {
  await cleanupTestData(context);
});

describe('Enrollment Mutations', () => {
  it('should enroll a user in a public training and set status to APPROVED', async () => {
    const result = await mutations.subscribeToTraining(
      null,
      { trainingId: 'public-training' },
      context
    );

    expect(result).toBeDefined();
    expect(result.trainingId).toBe('public-training');
    expect(result.userId).toBe('user123');
    expect(result.status).toBe('APPROVED');
  });

  it('should enroll a user in a private training and set status to PENDING', async () => {
    const result = await mutations.subscribeToTraining(
      null,
      { trainingId: 'private-training' },
      context
    );

    expect(result).toBeDefined();
    expect(result.trainingId).toBe('private-training');
    expect(result.userId).toBe('user123');
    expect(result.status).toBe('PENDING');
  })

  it('should throw an error if the user is already enrolled', async () => {
    await mutations.subscribeToTraining(
      null,
      { trainingId: 'public-training' },
      context
    );

    await expect(
      mutations.subscribeToTraining(
        null,
        { trainingId: 'public-training' },
        context
      )
    ).rejects.toThrowError(/Already enrolled to this training/);
  });
});