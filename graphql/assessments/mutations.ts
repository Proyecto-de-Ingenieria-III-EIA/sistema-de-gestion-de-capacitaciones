import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const mutations = {
  // Create a new assessment
  createAssessment: async (
    _: unknown,
    args: { trainingId: string; title: string }
  ) =>
    prisma.assessment.create({
      data: {
        trainingId: args.trainingId,
        title: args.title,
      },
    }),

  // Add a question to an assessment
  addQuestion: async (
    _: unknown,
    args: {
      assessmentId: string;
      question: string;
      options: string[];
      answer: string;
    }
  ) =>
    prisma.question.create({
      data: {
        assessmentId: args.assessmentId,
        question: args.question,
        options: args.options,
        answer: args.answer,
      },
    }),

  // Submit an assessment result
  submitAssessmentResult: async (
    _: unknown,
    args: { assessmentId: string; userId: string; score: number }
  ) =>
    prisma.assessmentResult.create({
      data: {
        assessmentId: args.assessmentId,
        userId: args.userId,
        score: args.score,
      },
    }),
};
