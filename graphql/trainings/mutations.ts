import { Context } from '@/types';

export const mutations = {
  // Training materials mutations
  createTrainingMaterial: async (
    _: unknown,
    args: { trainingId: string; fileType: string; fileUrl: string },
    { db }: Context
  ) => {
    const trainingExists = await db.training.findUnique({
      where: { id: args.trainingId },
    });

    if (!trainingExists) {
      throw new Error('Training not found');
    }

    return db.trainingMaterial.create({
      data: {
        trainingId: args.trainingId,
        fileType: args.fileType,
        fileUrl: args.fileUrl,
      },
    });
  },

  updateTrainingMaterial: async (
    _: unknown,
    args: { id: string; fileType?: string; fileUrl?: string },
    { db }: Context
  ) => {
    const trainingMaterialExists = await db.trainingMaterial.findUnique({
      where: { id: args.id },
    });

    if (!trainingMaterialExists) {
      throw new Error('Training material not found');
    }

    return db.trainingMaterial.update({
      where: { id: args.id },
      data: {
        fileType: args.fileType ?? trainingMaterialExists.fileType,
        fileUrl: args.fileUrl ?? trainingMaterialExists.fileUrl,
      },
    });
  },

  deleteTrainingMaterial: async (
    _: unknown,
    args: { id: string },
    { db }: Context
  ) => {
    await db.trainingMaterial.delete({ where: { id: args.id } });
    return true;
  },
  // Training mutations
  createTraining: async (
    _: unknown,
    args: { title: string; description: string; instructorId: string },
    { db }: Context
  ) =>
    db.training.create({
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
    },
    { db }: Context
  ) =>
    db.training.update({
      where: { id: args.id },
      data: {
        title: args.title,
        description: args.description,
        isHidden: args.isHidden,
      },
    }),

  deleteTraining: async (_: unknown, args: { id: string }, { db }: Context) => {
    await db.training.delete({ where: { id: args.id } });
    return true;
  },
};
