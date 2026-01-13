# ArdaGraph Neo4j Schema

## Node Labels

### Entity
Represents any character, place, artifact, event, or group in Tolkien's legendarium.

**Properties:**
- `id` (string, unique) - UUID or generated ID
- `slug` (string, unique) - URL-friendly identifier
- `name` (string) - Canonical name
- `type` (enum) - CHARACTER | PLACE | ARTIFACT | EVENT | GROUP
- `summary` (string, optional) - Brief description (1-3 sentences)
- `aliases` (string[], optional) - Alternative names
- `createdAt` (datetime, optional)
- `updatedAt` (datetime, optional)

### Work
Represents a published work by Tolkien.

**Properties:**
- `id` (string, unique)
- `slug` (string, unique)
- `title` (string)
- `workType` (enum) - NOVEL | COLLECTION | POETRY | ESSAY | LETTER
- `publicationYear` (number, optional)
- `summary` (string, optional)
- `author` (string, optional)

### Section (Optional for MVP)
Represents a chapter, section, or subdivision of a Work.

**Properties:**
- `id` (string, unique)
- `slug` (string, unique)
- `title` (string)
- `ordinal` (number, optional) - Order within the work
- `summary` (string, optional)

### Event
Represents a significant event in Middle-earth history.

**Properties:**
- `id` (string, unique)
- `slug` (string, unique)
- `name` (string)
- `eventType` (enum) - BATTLE | COUNCIL | JOURNEY | BIRTH | DEATH | MEETING | OTHER
- `summary` (string, optional)

### TimeRef
Represents a point or period in time within Middle-earth chronology.

**Properties:**
- `id` (string, unique)
- `age` (enum) - FA | SA | TA | FO | OTHER | UNKNOWN
- `year` (number, optional) - Year within the age
- `sortKey` (number) - Numeric key for chronological sorting
- `display` (string) - Human-readable representation (e.g., "TA 3018")

## Relationship Types

### RELATED_TO
Generic relationship between entities.

**From:** Entity
**To:** Entity
**Properties:**
- `predicate` (string) - Describes the relationship (e.g., "father of", "located in", "created by")

### APPEARS_IN
Indicates an entity appears in a work or section.

**From:** Entity
**To:** Work or Section
**Properties:** None

### ALIAS_OF
Indicates one entity is an alias of another.

**From:** Entity
**To:** Entity
**Properties:** None

### OCCURS_DURING
Links an event to a time reference.

**From:** Event
**To:** TimeRef
**Properties:** None

### PARTICIPATES_IN
Links an entity to an event they participated in.

**From:** Entity
**To:** Event
**Properties:**
- `role` (string, optional) - Role in the event (e.g., "leader", "participant", "victim")

### IN_WORK (Optional for MVP)
Links a section to its parent work.

**From:** Section
**To:** Work
**Properties:** None

## Example Cypher Queries

### Create an Entity
```cypher
CREATE (e:Entity {
  id: 'uuid-123',
  slug: 'gandalf',
  name: 'Gandalf',
  type: 'CHARACTER',
  summary: 'A wizard of the Istari order, known as Gandalf the Grey.',
  aliases: ['Mithrandir', 'Olorin', 'The Grey Pilgrim']
})
```

### Create a Relationship
```cypher
MATCH (a:Entity {slug: 'gandalf'})
MATCH (b:Entity {slug: 'saruman'})
CREATE (a)-[:RELATED_TO {predicate: 'colleague of'}]->(b)
```

### Find Entity with Relationships
```cypher
MATCH (e:Entity {slug: 'gandalf'})
OPTIONAL MATCH (e)-[r]->(related)
RETURN e, r, related
```

### Search Entities
```cypher
CALL db.index.fulltext.queryNodes('entity_search', 'Gandalf~') 
YIELD node, score
RETURN node, score
ORDER BY score DESC
LIMIT 10
```

### Get Entity Graph (1-hop neighbors)
```cypher
MATCH (center:Entity {slug: 'gandalf'})
OPTIONAL MATCH (center)-[r]-(neighbor:Entity)
RETURN center, r, neighbor
```

## Constraints and Indexes

See `constraints.cypher` and `indexes.cypher` for the full list of constraints and indexes to be created on the database.

## Data Model Design Decisions

1. **Simplified Schema for MVP**: We've removed the Claims and Sources nodes from the initial implementation to reduce complexity. These can be added in v2 for provenance tracking.

2. **Generic RELATED_TO**: Instead of creating many specific relationship types, we use a single RELATED_TO type with a `predicate` property for flexibility.

3. **TimeRef Nodes**: Events are linked to TimeRef nodes rather than storing dates directly on events, allowing for flexible time representations and better querying.

4. **Full-text Search**: We use Neo4j's built-in full-text indexing instead of an external search engine (OpenSearch) for the MVP.

5. **Aliases as Property**: Aliases are stored as a property array rather than separate nodes with ALIAS_OF relationships for simpler querying.

