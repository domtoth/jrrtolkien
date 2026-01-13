import { Context } from '../context.js';

export const searchResolvers = {
  Query: {
    search: async (_parent: any, args: { query: string; limit?: number }, context: Context) => {
      const limit = args.limit || 10;
      return await context.queries.searchEntities(args.query, limit);
    },
  },
};

