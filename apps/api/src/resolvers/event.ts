import { Context } from '../context.js';

export const eventResolvers = {
  Query: {
    events: async (_parent: any, args: { limit?: number }, context: Context) => {
      const limit = args.limit || 20;
      const query = `
        MATCH (e:Event)
        OPTIONAL MATCH (e)-[:OCCURS_DURING]->(t:TimeRef)
        RETURN e, t
        ORDER BY t.sortKey DESC
        LIMIT $limit
      `;
      const result = await context.client.executeRead(query, { limit });

      return result.records.map((record) => {
        const eventNode = record.get('e');
        const timeNode = record.get('t');

        return {
          id: eventNode.properties.id,
          slug: eventNode.properties.slug,
          name: eventNode.properties.name,
          eventType: eventNode.properties.eventType,
          summary: eventNode.properties.summary,
          timeRef: timeNode
            ? {
                id: timeNode.properties.id,
                age: timeNode.properties.age,
                year: timeNode.properties.year,
                sortKey: timeNode.properties.sortKey,
                display: timeNode.properties.display,
              }
            : null,
        };
      });
    },
  },
};

