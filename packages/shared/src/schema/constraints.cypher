// Create unique constraints for all primary node types

// Entity constraints
CREATE CONSTRAINT entity_id IF NOT EXISTS
FOR (e:Entity) REQUIRE e.id IS UNIQUE;

CREATE CONSTRAINT entity_slug IF NOT EXISTS
FOR (e:Entity) REQUIRE e.slug IS UNIQUE;

// Work constraints
CREATE CONSTRAINT work_id IF NOT EXISTS
FOR (w:Work) REQUIRE w.id IS UNIQUE;

CREATE CONSTRAINT work_slug IF NOT EXISTS
FOR (w:Work) REQUIRE w.slug IS UNIQUE;

// Section constraints (if used)
CREATE CONSTRAINT section_id IF NOT EXISTS
FOR (s:Section) REQUIRE s.id IS UNIQUE;

CREATE CONSTRAINT section_slug IF NOT EXISTS
FOR (s:Section) REQUIRE s.slug IS UNIQUE;

// Event constraints
CREATE CONSTRAINT event_id IF NOT EXISTS
FOR (e:Event) REQUIRE e.id IS UNIQUE;

CREATE CONSTRAINT event_slug IF NOT EXISTS
FOR (e:Event) REQUIRE e.slug IS UNIQUE;

// TimeRef constraints
CREATE CONSTRAINT timeref_id IF NOT EXISTS
FOR (t:TimeRef) REQUIRE t.id IS UNIQUE;

