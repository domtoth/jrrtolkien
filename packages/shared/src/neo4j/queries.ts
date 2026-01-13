import { Neo4jClient } from './client';
import { Entity, EntityType, Event, Work } from '../types';

export class Neo4jQueries {
  constructor(private client: Neo4jClient) {}

  // Create Entity node
  async createEntity(entity: Entity): Promise<void> {
    const query = `
      MERGE (e:Entity {id: $id})
      SET e.slug = $slug,
          e.name = $name,
          e.type = $type,
          e.summary = $summary,
          e.aliases = $aliases,
          e.createdAt = datetime(),
          e.updatedAt = datetime()
      RETURN e
    `;
    await this.client.executeWrite(query, {
      ...entity,
      aliases: entity.aliases || []
    });
  }

  // Create Work node
  async createWork(work: Work): Promise<void> {
    const query = `
      MERGE (w:Work {id: $id})
      SET w.slug = $slug,
          w.title = $title,
          w.workType = $workType,
          w.publicationYear = $publicationYear,
          w.summary = $summary,
          w.author = $author
      RETURN w
    `;
    await this.client.executeWrite(query, work);
  }

  // Create Event node with TimeRef
  async createEvent(event: Event): Promise<void> {
    if (event.timeRef) {
      const timeQuery = `
        MERGE (t:TimeRef {id: $timeId})
        SET t.age = $age,
            t.year = $year,
            t.sortKey = $sortKey,
            t.display = $display
        RETURN t
      `;
      await this.client.executeWrite(timeQuery, {
        timeId: event.timeRef.id,
        age: event.timeRef.age,
        year: event.timeRef.year,
        sortKey: event.timeRef.sortKey,
        display: event.timeRef.display,
      });
    }

    const eventQuery = `
      MERGE (e:Event {id: $id})
      SET e.slug = $slug,
          e.name = $name,
          e.eventType = $eventType,
          e.summary = $summary
      WITH e
      ${
        event.timeRef
          ? `
      MATCH (t:TimeRef {id: $timeId})
      MERGE (e)-[:OCCURS_DURING]->(t)
      `
          : ''
      }
      RETURN e
    `;
    await this.client.executeWrite(eventQuery, {
      id: event.id,
      slug: event.slug,
      name: event.name,
      eventType: event.eventType,
      summary: event.summary,
      timeId: event.timeRef?.id,
    });
  }

  // Create relationship
  async createRelationship(
    type: string,
    fromId: string,
    toId: string,
    predicate?: string,
    properties?: Record<string, any>
  ): Promise<void> {
    const query = `
      MATCH (from {id: $fromId})
      MATCH (to {id: $toId})
      MERGE (from)-[r:${type}]->(to)
      ${predicate ? 'SET r.predicate = $predicate' : ''}
      ${properties ? 'SET r += $properties' : ''}
      RETURN r
    `;
    await this.client.executeWrite(query, { fromId, toId, predicate, properties });
  }

  // Get entity by slug
  async getEntityBySlug(slug: string): Promise<Entity | null> {
    const query = `
      MATCH (e:Entity {slug: $slug})
      RETURN e
    `;
    const result = await this.client.executeRead(query, { slug });
    if (result.records.length === 0) return null;
    const node = result.records[0].get('e');
    return {
      id: node.properties.id,
      slug: node.properties.slug,
      name: node.properties.name,
      type: node.properties.type as EntityType,
      summary: node.properties.summary,
      aliases: node.properties.aliases || [],
    };
  }

  // Get entity with relationships
  async getEntityWithRelationships(slug: string) {
    const query = `
      MATCH (e:Entity {slug: $slug})
      OPTIONAL MATCH (e)-[r:RELATED_TO]->(related:Entity)
      RETURN e, collect({
        id: id(r),
        predicate: r.predicate,
        targetId: related.id,
        targetName: related.name,
        targetType: related.type,
        targetSlug: related.slug
      }) as relationships
    `;
    const result = await this.client.executeRead(query, { slug });
    if (result.records.length === 0) return null;

    const record = result.records[0];
    const node = record.get('e');
    const relationships = record.get('relationships').filter((r: any) => r.targetId);

    return {
      id: node.properties.id,
      slug: node.properties.slug,
      name: node.properties.name,
      type: node.properties.type as EntityType,
      summary: node.properties.summary,
      aliases: node.properties.aliases || [],
      relationships,
    };
  }

  // Get entity graph (neighbors)
  async getEntityGraph(slug: string, depth: number = 1) {
    const query = `
      MATCH (center:Entity {slug: $slug})
      CALL apoc.path.subgraphAll(center, {
        maxLevel: $depth,
        relationshipFilter: 'RELATED_TO|APPEARS_IN|PARTICIPATES_IN'
      })
      YIELD nodes, relationships
      RETURN nodes, relationships
    `;

    // Fallback query without APOC
    const fallbackQuery = `
      MATCH (center:Entity {slug: $slug})
      OPTIONAL MATCH path = (center)-[r]-(neighbor)
      WHERE 1 <= length(path) <= $depth
      WITH center, collect(DISTINCT neighbor) as neighbors, collect(DISTINCT r) as rels
      RETURN [center] + neighbors as nodes, rels as relationships
    `;

    try {
      const result = await this.client.executeRead(fallbackQuery, { slug, depth });
      if (result.records.length === 0) return { nodes: [], edges: [] };

      const record = result.records[0];
      const nodes = record.get('nodes').map((n: any) => ({
        id: n.properties.id,
        slug: n.properties.slug,
        name: n.properties.name || n.properties.title,
        type: n.properties.type,
        summary: n.properties.summary,
      }));

      const edges = record
        .get('relationships')
        .filter((r: any) => r)
        .map((r: any) => ({
          id: r.elementId,
          from: r.start.toString(),
          to: r.end.toString(),
          predicate: r.properties.predicate || r.type,
          type: r.type,
        }));

      return { nodes, edges, centerNode: slug };
    } catch (error) {
      console.error('Error getting entity graph:', error);
      return { nodes: [], edges: [], centerNode: slug };
    }
  }

  // Search entities
  async searchEntities(query: string, limit: number = 10) {
    const searchQuery = `
      CALL db.index.fulltext.queryNodes('entity_search', $query) 
      YIELD node, score
      RETURN node, score
      ORDER BY score DESC
      LIMIT $limit
    `;

    // Fallback without fulltext index
    const fallbackQuery = `
      MATCH (e:Entity)
      WHERE toLower(e.name) CONTAINS toLower($query)
      RETURN e as node, 1.0 as score
      LIMIT $limit
    `;

    try {
      const result = await this.client.executeRead(fallbackQuery, { query, limit });
      return result.records.map((record) => {
        const node = record.get('node');
        const score = record.get('score');
        return {
          id: node.properties.id,
          slug: node.properties.slug,
          name: node.properties.name,
          type: node.properties.type,
          snippet: node.properties.summary,
          score,
        };
      });
    } catch (error) {
      console.error('Error searching entities:', error);
      return [];
    }
  }

  // Get all entities by type
  async getEntitiesByType(type?: EntityType, limit: number = 20) {
    const query = type
      ? `
      MATCH (e:Entity {type: $type})
      RETURN e
      LIMIT $limit
    `
      : `
      MATCH (e:Entity)
      RETURN e
      LIMIT $limit
    `;

    const result = await this.client.executeRead(query, { type, limit });
    return result.records.map((record) => {
      const node = record.get('e');
      return {
        id: node.properties.id,
        slug: node.properties.slug,
        name: node.properties.name,
        type: node.properties.type as EntityType,
        summary: node.properties.summary,
        aliases: node.properties.aliases || [],
      };
    });
  }
}

export function createQueries(client: Neo4jClient): Neo4jQueries {
  return new Neo4jQueries(client);
}

