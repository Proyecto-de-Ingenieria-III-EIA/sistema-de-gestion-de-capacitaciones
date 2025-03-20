import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { setupTestData, cleanupTestData } from './setup';
import { Context } from '@/types';
import { prisma } from '@/prisma';

let context: Context;

beforeAll(async () => {
  context = {
    db: prisma,
    authData: { id: 'admin123', email: 'test@example.com', role: 'ADMIN', expires: new Date() },
  };

  await setupTestData(context);
});

afterAll(async () => {
  await cleanupTestData(context);
});

describe('Training Instructor Assigment', () => {
    it('should correctly assign an instructor to a trainig', async () => {
  
      const existingTraining = await context.db.training.findUnique({
        where: { id: 'training123' },
      })
  
  
      if (!existingTraining) {
        throw new Error ('Training not found');
      }
  
      const updatedTraining = await context.db.training.update({
        where: { id: 'training123' },
        data: { instructorId: 'instructor123' },
      });
  
  
  
      expect(updatedTraining).toBeDefined();
      expect(updatedTraining.instructorId).toBe('instructor123');
    });
  
    it('should replace an existing instructor with a new one', async () => {
      //Asignr un instructor inicial
      await context.db.training.update({
        where: { id: 'training123' },
        data: { instructorId: 'instructor123' },
      });
  
      // Reemplazar el instructor
      const updatedTraining = await context.db.training.update({
        where: { id: 'training123' },
        data: { instructorId: 'instructor456' },
      });
  
      expect(updatedTraining).toBeDefined();
      expect(updatedTraining.instructorId).toBe('instructor456');
    });
  });