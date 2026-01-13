import { Context } from '../context.js';

export const workResolvers = {
  Query: {
    work: async (_parent: any, args: { slug: string }, context: Context) => {
      const query = `
        MATCH (w:Work {slug: $slug})
        RETURN w
      `;
      const result = await context.client.executeRead(query, { slug: args.slug });
      if (result.records.length === 0) return null;

      const node = result.records[0].get('w');
      return {
        id: node.properties.id,
        slug: node.properties.slug,
        title: node.properties.title,
        workType: node.properties.workType,
        publicationYear: node.properties.publicationYear,
        summary: node.properties.summary,
        author: node.properties.author,
      };
    },

    works: async (_parent: any, _args: any, context: Context) => {
      const query = `
        MATCH (w:Work)
        RETURN w
        ORDER BY w.publicationYear
      `;
      const result = await context.client.executeRead(query);
      return result.records.map((record) => {
        const node = record.get('w');
        return {
          id: node.properties.id,
          slug: node.properties.slug,
          title: node.properties.title,
          workType: node.properties.workType,
          publicationYear: node.properties.publicationYear,
          summary: node.properties.summary,
          author: node.properties.author,
        };
      });
    },
  },
};

