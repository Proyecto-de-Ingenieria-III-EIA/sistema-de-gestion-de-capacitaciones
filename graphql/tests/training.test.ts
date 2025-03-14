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

describe('Training Queries', () => {
  it('should fetch all trainings', async () => {
    const trainings = await context.db.training.findMany();
    expect(trainings).toBeDefined();
    expect(trainings.length).toBeGreaterThan(0);
  });

  it('should fetch a training by ID', async () => {
    const training = await context.db.training.findUnique({
      where: { id: 'training123' },
    });
    expect(training).toBeDefined();
    expect(training?.title).toBe('AI Fundamentals');
  });
});

describe('Training Mutations', () => {
  it('should create a new training', async () => {
    const newTraining = await context.db.training.create({
      data: {
        title: 'ML Basics',
        description: 'Intro to ML',
        instructorId: 'instructor123',
      },
    });
    expect(newTraining).toBeDefined();
    expect(newTraining.title).toBe('ML Basics');
  });

  it('should update a training', async () => {
    const updateTraining = await context.db.training.update({
      where: { id: 'training123'},
      data: {
        title: 'Updated ML Basics',
        description: 'Updated Intro to ML',
        isHidden: false,
      },
    });
    expect(updateTraining).toBeDefined();
    expect(updateTraining.title).toBe('Updated ML Basics');
    expect(updateTraining.description).toBe('Updated Intro to ML');
    expect(updateTraining.isHidden).toBe(false);
  })

  it('should delete a training', async () => {
    const deletedTraining = await context.db.training.delete({
      where: { id: 'training123' },
    });
    expect(deletedTraining).toBeDefined();

    // Verify that querying the deleted training returns null
    const training = await context.db.training.findUnique({
      where: { id: 'training123' },
    });
    expect(training).toBeNull();
  });
});


