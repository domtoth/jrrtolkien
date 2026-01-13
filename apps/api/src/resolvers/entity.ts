import { Context } from '../context.js';
import { EntityType } from 'shared';

export const entityResolvers = {
  Query: {
    entity: async (_parent: any, args: { slug: string }, context: Context) => {
      const entity = await context.queries.getEntityWithRelationships(args.slug);
      return entity;
    },

    entities: async (
      _parent: any,
      args: { type?: EntityType; limit?: number },
      context: Context
    ) => {
      const limit = args.limit || 20;
      return await context.queries.getEntitiesByType(args.type, limit);
    },

    entityGraph: async (
      _parent: any,
      args: { slug: string; depth?: number },
      context: Context
    ) => {
      const depth = args.depth || 1;
      return await context.queries.getEntityGraph(args.slug, depth);
    },
  },
};

