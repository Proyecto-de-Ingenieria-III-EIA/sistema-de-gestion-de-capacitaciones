import { Context } from '@/types';

export const queries = {
  getRoles: async ({ db }: Context) => db.role.findMany(),
};
