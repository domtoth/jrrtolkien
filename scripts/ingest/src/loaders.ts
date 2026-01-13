import { readFileSync } from 'fs';
import { join } from 'path';
import { Entity, Work, Event, RelationshipData } from 'shared';

export function loadWorks(): Work[] {
  const filePath = join(process.cwd(), '../../data/seed/works.json');
  const data = readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

export function loadEntities(): Entity[] {
  const filePath = join(process.cwd(), '../../data/seed/entities.json');
  const data = readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

export function loadEvents(): Event[] {
  const filePath = join(process.cwd(), '../../data/seed/events.json');
  const data = readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

export function loadRelationships(): RelationshipData[] {
  const filePath = join(process.cwd(), '../../data/seed/relationships.json');
  const data = readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

