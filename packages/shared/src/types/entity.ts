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
  createdAt?: Date;
  updatedAt?: Date;
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

