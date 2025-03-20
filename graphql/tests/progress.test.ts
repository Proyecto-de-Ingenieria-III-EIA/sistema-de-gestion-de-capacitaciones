import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { setupTestData, cleanupTestData } from './setup';
import { prisma } from '@/prisma';
import { Context } from '@/types';
import { queries } from '../enrollments/queries';

let context: Context;
let testUserId: string;

beforeAll(async () => {
  context = {
    db: prisma,
    authData: { email: 'admin@example.com', id: 'admin123', role: 'ADMIN', expires: new Date() },
  };

  await setupTestData(context);

  testUserId = 'user123'; 

  
  await context.db.enrollment.createMany({
    data: [
      { trainingId: 'public-training', userId: testUserId, status: 'APPROVED', progress: 'COMPLETED' },
      { trainingId: 'private-training', userId: testUserId, status: 'APPROVED', progress: 'IN_PROGRESS' },
      { trainingId: 'training123', userId: testUserId, status: 'APPROVED', progress: 'COMPLETED' },
    ],
  });
});

afterAll(async () => {
    await cleanupTestData(context);
  });

  describe('Participant Progress Queries', () => {

    it('should return the correct progress for each participant', async () => {
        const progressData = await queries.getParticipantsProgress(null, null, context);
    
        expect(progressData).toBeInstanceOf(Array);
        expect(progressData.length).toBeGreaterThan(0);
    
        const userProgress = progressData.find((p) => p.userId === testUserId);
        expect(userProgress).toBeDefined();
        expect(userProgress?.totalTrainings).toBe(3);
        expect(userProgress?.completedTrainings).toBe(2);
        expect(userProgress?.completionRate).toBe('66.67%'); // 2 de 3 completadas
      });

      it('should return  0% completion if the usr has no completed trainings', async () => {
        const newUser = await context.db.user.create({
            data: { id: 'newuser456', email: 'newuser@example.com', name: 'New User', roleId: 1 },
        });

        await context.db.enrollment.create({
            data: { trainingId: 'public-training', userId: newUser.id, status: 'APPROVED', progress: 'IN_PROGRESS' },
        });

        const progressData = await queries.getParticipantsProgress(null, null, context);
        const newUserProgress = progressData.find((p) => p.userId === newUser.id);

        expect(newUserProgress).toBeDefined();
        expect(newUserProgress?.totalTrainings).toBe(1);
        expect(newUserProgress?.completedTrainings).toBe(0);
        expect(newUserProgress?.completionRate).toBe('0.00%');
      });

      it('should return the progress of a logged-in user', async () => {


        const progress = await queries.getUserProgress(null, {}, {
            ...context,
            authData : {  email: 'test@example.com', id: 'user123', role: 'USER', expires: new Date() },
        });

        expect(progress).toBeDefined();
        expect(progress.userId).toBe(testUserId);
        expect(progress.totalTrainings).toBe(3);
        expect(progress.completedTrainings).toBe(2);
        expect(progress.completionRate).toBe('66.67%');
      })
  });