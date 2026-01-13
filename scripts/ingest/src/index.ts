import 'dotenv/config';
import { initializeNeo4j, createQueries } from 'shared';
import { loadWorks, loadEntities, loadEvents, loadRelationships } from './loaders.js';
import {
  validateEntities,
  validateWorks,
  validateEvents,
  validateRelationships,
} from './validators.js';
import { readFileSync } from 'fs';
import { join } from 'path';

async function initializeSchema(client: any) {
  console.log('Initializing Neo4j schema...');

  // Read and execute constraints
  const constraintsPath = join(process.cwd(), 'packages/shared/src/schema/constraints.cypher');
  const constraints = readFileSync(constraintsPath, 'utf-8')
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('//'));

  for (const constraint of constraints) {
    try {
      await client.executeWrite(constraint);
    } catch (error: any) {
      // Ignore if constraint already exists
      if (!error.message.includes('already exists')) {
        console.error(`Error creating constraint: ${error.message}`);
      }
    }
  }

  // Read and execute indexes
  const indexesPath = join(process.cwd(), 'packages/shared/src/schema/indexes.cypher');
  const indexes = readFileSync(indexesPath, 'utf-8')
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('//'));

  for (const index of indexes) {
    try {
      await client.executeWrite(index);
    } catch (error: any) {
      // Ignore if index already exists
      if (!error.message.includes('already exists')) {
        console.error(`Error creating index: ${error.message}`);
      }
    }
  }

  console.log('Schema initialization complete');
}

async function ingest() {
  console.log('🚀 Starting data ingestion...\n');

  try {
    // Initialize Neo4j client
    console.log('Connecting to Neo4j...');
    const client = await initializeNeo4j();
    const queries = createQueries(client);

    // Initialize schema
    await initializeSchema(client);

    // Load data
    console.log('\n📚 Loading seed data...');
    const works = loadWorks();
    const entities = loadEntities();
    const events = loadEvents();
    const relationships = loadRelationships();

    console.log(`Loaded ${works.length} works`);
    console.log(`Loaded ${entities.length} entities`);
    console.log(`Loaded ${events.length} events`);
    console.log(`Loaded ${relationships.length} relationships`);

    // Validate data
    console.log('\n✅ Validating data...');
    const workValidation = validateWorks(works);
    const entityValidation = validateEntities(entities);
    const eventValidation = validateEvents(events);

    const entityIds = new Set(entities.map((e) => e.id));
    const workIds = new Set(works.map((w) => w.id));
    const eventIds = new Set(events.map((e) => e.id));
    const relationshipValidation = validateRelationships(
      relationships,
      entityIds,
      workIds,
      eventIds
    );

    const allErrors = [
      ...workValidation.errors,
      ...entityValidation.errors,
      ...eventValidation.errors,
      ...relationshipValidation.errors,
    ];

    if (allErrors.length > 0) {
      console.error('❌ Validation errors:');
      allErrors.forEach((err) => console.error(`  - ${err}`));
      process.exit(1);
    }

    console.log('All data validated successfully');

    // Create Works
    console.log('\n📖 Creating works...');
    for (const work of works) {
      await queries.createWork(work);
    }
    console.log(`Created ${works.length} works`);

    // Create Entities
    console.log('\n👤 Creating entities...');
    for (const entity of entities) {
      await queries.createEntity(entity);
    }
    console.log(`Created ${entities.length} entities`);

    // Create Events
    console.log('\n⚔️  Creating events...');
    for (const event of events) {
      await queries.createEvent(event);
    }
    console.log(`Created ${events.length} events`);

    // Create Relationships
    console.log('\n🔗 Creating relationships...');
    for (const rel of relationships) {
      await queries.createRelationship(
        rel.type,
        rel.fromId,
        rel.toId,
        rel.predicate,
        rel.properties
      );
    }
    console.log(`Created ${relationships.length} relationships`);

    // Generate report
    console.log('\n📊 Ingestion Report:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✓ Works:         ${works.length}`);
    console.log(`✓ Entities:      ${entities.length}`);
    console.log(`✓ Events:        ${events.length}`);
    console.log(`✓ Relationships: ${relationships.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✨ Ingestion completed successfully!\n');

    await client.disconnect();
  } catch (error) {
    console.error('\n❌ Ingestion failed:', error);
    process.exit(1);
  }
}

// Run ingestion
ingest();

