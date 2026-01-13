export enum EntityType {
  CHARACTER = 'CHARACTER',
  PLACE = 'PLACE',
  ARTIFACT = 'ARTIFACT',
  EVENT = 'EVENT',
  GROUP = 'GROUP',
}

export interface Entity {
  id: string;
  slug: string;
  name: string;
  type: EntityType;
  summary?: string;
  aliases?: string[];
}

export interface EntityWithRelationships extends Entity {
  relationships: Relationship[];
}

export interface Relationship {
  id: string;
  predicate: string;
  targetId: string;
  targetName: string;
  targetType: EntityType;
  targetSlug: string;
}

export interface SearchResult {
  id: string;
  slug: string;
  name: string;
  type: EntityType;
  snippet?: string;
  score?: number;
}

export interface GraphNode {
  id: string;
  slug: string;
  name: string;
  type: EntityType;
  summary?: string;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  predicate: string;
  type: string;
}

export interface GraphData {
  centerNode: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

