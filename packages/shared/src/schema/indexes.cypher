// Create indexes for efficient queries

// Full-text index for entity search
CREATE FULLTEXT INDEX entity_search IF NOT EXISTS
FOR (e:Entity)
ON EACH [e.name, e.aliases];

// Full-text index for work search
CREATE FULLTEXT INDEX work_search IF NOT EXISTS
FOR (w:Work)
ON EACH [w.title];

// Property indexes for filtering
CREATE INDEX entity_type IF NOT EXISTS
FOR (e:Entity) ON (e.type);

CREATE INDEX event_type IF NOT EXISTS
FOR (e:Event) ON (e.eventType);

CREATE INDEX timeref_age IF NOT EXISTS
FOR (t:TimeRef) ON (t.age);

CREATE INDEX timeref_sortkey IF NOT EXISTS
FOR (t:TimeRef) ON (t.sortKey);

CREATE INDEX timeref_year IF NOT EXISTS
FOR (t:TimeRef) ON (t.year);

