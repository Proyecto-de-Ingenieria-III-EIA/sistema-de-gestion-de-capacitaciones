import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { setupTestData, cleanupTestData } from './setup';
import { Context } from '@/types';
import { prisma } from '@/prisma';

let context: Context;
let trainingId: string;

beforeAll(async () => {
  context = {
    db: prisma,
    authData: { email: 'test@example.com', role: 'ADMIN', expires: new Date() },
  };

  await setupTestData(context);

  const training = await context.db.training.findUnique({
    where: { id: 'training123' },
  });
  trainingId = training?.id ?? '';
});

afterAll(async () => {
  await cleanupTestData(context);
});

describe('Training Material Mutations', () => {
  it('should create a training material', async () => {
    const trainingMaterial = await context.db.trainingMaterial.create({
      data: {
        trainingId,
        fileType: 'PDF',
        fileUrl: 'https://example.com/material.pdf',
      },
    });
    expect(trainingMaterial).toBeDefined();
    expect(trainingMaterial.fileType).toBe('PDF');
  });

  it('should delete a training material', async () => {
    // First, create a training material to delete
    const createResponse = await context.db.trainingMaterial.create({
      data: {
        trainingId,
        fileType: 'PDF',
        fileUrl: 'https://example.com/material.pdf',
      },
    });

    const deletedMaterial = await context.db.trainingMaterial.delete({
      where: { id: createResponse.id },
    });

    expect(deletedMaterial).toBeDefined();

    // Verify that the training material was actually deleted
    const material = await context.db.trainingMaterial.findUnique({
      where: { id: createResponse.id },
    });
    expect(material).toBeNull();
  });

  it('should retrieve training materials for a training', async () => {
    // Ensure test data exists
    await context.db.trainingMaterial.createMany({
      data: [
        {
          trainingId,
          fileType: 'PDF',
          fileUrl: 'https://example.com/material1.pdf',
        },
        {
          trainingId,
          fileType: 'Video',
          fileUrl: 'https://example.com/material2.mp4',
        },
      ],
    });

    const materials = await context.db.trainingMaterial.findMany({
      where: { trainingId },
    });

    expect(materials.length).toBeGreaterThanOrEqual(2);
    expect(materials.some((m) => m.fileType === 'PDF')).toBe(true);
    expect(materials.some((m) => m.fileType === 'Video')).toBe(true);
  });

  it('should update a training material', async () => {
    // First, create a training material to update
    const createResponse = await context.db.trainingMaterial.create({
      data: {
        trainingId,
        fileType: 'PDF',
        fileUrl: 'https://example.com/material.pdf',
      },
    });

    const updatedMaterial = await context.db.trainingMaterial.update({
      where: { id: createResponse.id },
      data: {
        fileType: 'Video',
        fileUrl: 'https://example.com/new-video.mp4',
      },
    });

    expect(updatedMaterial).toBeDefined();
    expect(updatedMaterial.fileType).toBe('Video');
    expect(updatedMaterial.fileUrl).toBe('https://example.com/new-video.mp4');
  });
});
