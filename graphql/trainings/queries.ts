import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const queries = {
  // Training queries
  getTrainings: async () => prisma.training.findMany(),

  getTrainingById: async (_: unknown, args: { id: string }) =>
    prisma.training.findUnique({ where: { id: args.id } }),

  //Training materials queries
  getTrainingMaterials: async (_: unknown, args: { trainingId: string }) =>
    prisma.trainingMaterial.findMany({
      where: { trainingId: args.trainingId },
    }),
};
