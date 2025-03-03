import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const mutations = {
  // Training materials mutations
  createTrainingMaterial: async (
    _: unknown,
    args: { trainingId: string; fileType: string; fileUrl: string }
  ) => {
    const trainingExists = await prisma.training.findUnique({
      where: { id: args.trainingId },
    });

    if (!trainingExists) {
      throw new Error('Training not found');
    }

    return prisma.trainingMaterial.create({
      data: {
        trainingId: args.trainingId,
        fileType: args.fileType,
        fileUrl: args.fileUrl,
      },
    });
  },

  updateTrainingMaterial: async (
    _: unknown,
    args: { id: string; fileType?: string; fileUrl?: string }
  ) => {
    const trainingMaterialExists = await prisma.trainingMaterial.findUnique({
      where: { id: args.id },
    });

    if (!trainingMaterialExists) {
      throw new Error('Training material not found');
    }

    return prisma.trainingMaterial.update({
      where: { id: args.id },
      data: {
        fileType: args.fileType ?? trainingMaterialExists.fileType,
        fileUrl: args.fileUrl ?? trainingMaterialExists.fileUrl,
      },
    });
  },

  deleteTrainingMaterial: async (_: unknown, args: { id: string }) => {
    await prisma.trainingMaterial.delete({ where: { id: args.id } });
    return true;
  },
  // Training mutations
  createTraining: async (
    _: unknown,
    args: { title: string; description: string; instructorId: string }
  ) =>
    prisma.training.create({
      data: {
        title: args.title,
        description: args.description,
        instructorId: args.instructorId,
      },
      include: { instructor: true },
    }),

  updateTraining: async (
    _: unknown,
    args: {
      id: string;
      title?: string;
      description?: string;
      isHidden?: boolean;
    }
  ) =>
    prisma.training.update({
      where: { id: args.id },
      data: {
        title: args.title,
        description: args.description,
        isHidden: args.isHidden,
      },
    }),

  deleteTraining: async (_: unknown, args: { id: string }) => {
    await prisma.training.delete({ where: { id: args.id } });
    return true;
  },
};
