import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { setupTestData, cleanupTestData } from './setup';
import { prisma } from '@/prisma';
import { Context } from '@/types';
import { mutations } from '../assessments/mutations';

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

describe('Assesment Mutations', () => {
    it('should create a new assessment', async () => {
        const assessment = await mutations.createAssessment(
            null,
            { trainingId: 'training123', title: 'Final Exam'},
            context
        ); 

        expect(assessment).toBeDefined();
        expect(assessment.title).toBe('Final Exam');
        expect(assessment.trainingId).toBe('training123');
    });

    it('should add a question to an assesment', async () => {

        //esconder el training
        await context.db.training.update({
            where: { id: 'training123' },
            data: { isHidden: true },
        });

        const question = await mutations.addQuestion(
            null, 
            {
                assessmentId: 'assessment123',
                question: 'What is the capital of France?',
                options: ['Paris', 'London', 'Berlin', 'Madrid'],
                answer: 'Paris'
            },
            context
        );

        expect(question).toBeDefined();
        expect(question.question).toBe('What is the capital of France?');
        expect(question.options).toContain('London');
        expect(question.answer).toBe('Paris');
    })
})

