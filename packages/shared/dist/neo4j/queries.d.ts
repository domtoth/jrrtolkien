import { Neo4jClient } from './client';
import { Entity, EntityType, Event, Work } from '../types';
export declare class Neo4jQueries {
    private client;
    constructor(client: Neo4jClient);
    createEntity(entity: Entity): Promise<void>;
    createWork(work: Work): Promise<void>;
    createEvent(event: Event): Promise<void>;
    createRelationship(type: string, fromId: string, toId: string, predicate?: string, properties?: Record<string, any>): Promise<void>;
    getEntityBySlug(slug: string): Promise<Entity | null>;
    getEntityWithRelationships(slug: string): Promise<{
        id: any;
        slug: any;
        name: any;
        type: EntityType;
        summary: any;
        aliases: any;
        relationships: any;
    } | null>;
    getEntityGraph(slug: string, depth?: number): Promise<{
        nodes: never[];
        edges: never[];
        centerNode?: undefined;
    } | {
        nodes: any;
        edges: any;
        centerNode: string;
    }>;
    searchEntities(query: string, limit?: number): Promise<{
        id: any;
        slug: any;
        name: any;
        type: any;
        snippet: any;
        score: any;
    }[]>;
    getEntitiesByType(type?: EntityType, limit?: number): Promise<{
        id: any;
        slug: any;
        name: any;
        type: EntityType;
        summary: any;
        aliases: any;
    }[]>;
}
export declare function createQueries(client: Neo4jClient): Neo4jQueries;
//# sourceMappingURL=queries.d.ts.map