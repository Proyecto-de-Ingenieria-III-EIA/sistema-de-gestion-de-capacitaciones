import { Context } from '@/types';

export const queries = {
  // Training queries
  getTrainings: async ({ db }: Context) => db.training.findMany(),

  getTrainingById: async (_: unknown, args: { id: string }, { db }: Context) =>
    db.training.findUnique({ where: { id: args.id } }),

  //Training materials queries
  getTrainingMaterials: async (
    _: unknown,
    args: { trainingId: string },
    { db }: Context
  ) =>
    db.trainingMaterial.findMany({
      where: { trainingId: args.trainingId },
    }),
};
