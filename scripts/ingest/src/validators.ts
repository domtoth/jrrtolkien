import { Entity, Work, Event, RelationshipData } from 'shared';

export function validateEntities(entities: Entity[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const entity of entities) {
    if (!entity.id) errors.push(`Entity missing id: ${JSON.stringify(entity)}`);
    if (!entity.slug) errors.push(`Entity missing slug: ${entity.id}`);
    if (!entity.name) errors.push(`Entity missing name: ${entity.id}`);
    if (!entity.type) errors.push(`Entity missing type: ${entity.id}`);

    if (ids.has(entity.id)) errors.push(`Duplicate entity id: ${entity.id}`);
    if (slugs.has(entity.slug)) errors.push(`Duplicate entity slug: ${entity.slug}`);

    ids.add(entity.id);
    slugs.add(entity.slug);
  }

  return { valid: errors.length === 0, errors };
}

export function validateWorks(works: Work[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const work of works) {
    if (!work.id) errors.push(`Work missing id: ${JSON.stringify(work)}`);
    if (!work.slug) errors.push(`Work missing slug: ${work.id}`);
    if (!work.title) errors.push(`Work missing title: ${work.id}`);

    if (ids.has(work.id)) errors.push(`Duplicate work id: ${work.id}`);
    if (slugs.has(work.slug)) errors.push(`Duplicate work slug: ${work.slug}`);

    ids.add(work.id);
    slugs.add(work.slug);
  }

  return { valid: errors.length === 0, errors };
}

export function validateEvents(events: Event[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const event of events) {
    if (!event.id) errors.push(`Event missing id: ${JSON.stringify(event)}`);
    if (!event.slug) errors.push(`Event missing slug: ${event.id}`);
    if (!event.name) errors.push(`Event missing name: ${event.id}`);

    if (ids.has(event.id)) errors.push(`Duplicate event id: ${event.id}`);
    if (slugs.has(event.slug)) errors.push(`Duplicate event slug: ${event.slug}`);

    ids.add(event.id);
    slugs.add(event.slug);
  }

  return { valid: errors.length === 0, errors };
}

export function validateRelationships(
  relationships: RelationshipData[],
  entityIds: Set<string>,
  workIds: Set<string>,
  eventIds: Set<string>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const allIds = new Set([...entityIds, ...workIds, ...eventIds]);

  for (const rel of relationships) {
    if (!rel.fromId) errors.push(`Relationship missing fromId: ${JSON.stringify(rel)}`);
    if (!rel.toId) errors.push(`Relationship missing toId: ${JSON.stringify(rel)}`);
    if (!rel.type) errors.push(`Relationship missing type: ${JSON.stringify(rel)}`);

    if (rel.fromId && !allIds.has(rel.fromId)) {
      errors.push(`Relationship fromId not found: ${rel.fromId}`);
    }
    if (rel.toId && !allIds.has(rel.toId)) {
      errors.push(`Relationship toId not found: ${rel.toId}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

