# ArdaGraph Quick Start Guide

Get ArdaGraph running locally in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js version (need 18+)
node --version

# Check pnpm (install if needed)
pnpm --version
# If not installed: npm install -g pnpm

# Check Neo4j - Option 1: Docker
docker --version

# OR Option 2: Neo4j Desktop
# Download from: https://neo4j.com/download
```

## Step 1: Install Dependencies

```bash
cd /Users/dom/workspace/ArdaGraph
pnpm install
```

Expected output: All packages installed successfully

## Step 2: Start Neo4j

### Option A: Docker (Recommended)

```bash
docker run \
  --name ardagraph-neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/ardagraph123 \
  -d \
  neo4j:5-community
```

Verify: Open http://localhost:7474 (Neo4j Browser)

### Option B: Neo4j Desktop

1. Open Neo4j Desktop
2. Create new project "ArdaGraph"
3. Add local DBMS with password `ardagraph123`
4. Start the database

## Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
NEO4J_URI=neo4j://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=ardagraph123
API_PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
```

## Step 4: Load Sample Data

```bash
pnpm ingest
```

Expected output:
```
🚀 Starting data ingestion...
✓ Works:         3
✓ Entities:      19
✓ Events:        8
✓ Relationships: 34
✨ Ingestion completed successfully!
```

## Step 5: Start the App

```bash
pnpm dev
```

This starts both API and Web servers:
- API: http://localhost:4000/graphql
- Web: http://localhost:3000

## Step 6: Try It Out!

1. **Open the app**: http://localhost:3000
2. **Search**: Type "Gandalf" in the search bar
3. **Browse**: Click "Browse" to see all entities
4. **Explore**: Click on any entity to see its graph
5. **Graph**: Interact with the force-directed graph visualization

## Troubleshooting

### "Can't connect to Neo4j"

```bash
# Check Neo4j is running
docker ps | grep neo4j
# OR check Neo4j Desktop

# Test connection
docker logs ardagraph-neo4j
```

### "No data found"

```bash
# Re-run ingestion
pnpm ingest

# Verify in Neo4j Browser (http://localhost:7474)
# Run query: MATCH (n) RETURN count(n)
```

### "Port already in use"

```bash
# Check what's using the port
lsof -i :4000  # API
lsof -i :3000  # Web

# Kill process or change port in .env
```

### "Module not found"

```bash
# Rebuild packages
pnpm install
pnpm --filter shared build
```

## Next Steps

- **Add more data**: Edit files in `data/seed/`
- **Customize**: Modify components in `apps/web/app/components/`
- **Extend API**: Add resolvers in `apps/api/src/resolvers/`
- **Deploy**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for Railway deployment

## Useful Commands

```bash
# Development
pnpm dev              # Start everything
pnpm dev:api          # API only
pnpm dev:web          # Web only

# Data
pnpm ingest           # Reload data
pnpm ingest --clean   # Clean and reload (future)

# Build
pnpm build            # Build for production

# Database
# Open Neo4j Browser
open http://localhost:7474
```

## Sample Cypher Queries

Open Neo4j Browser (http://localhost:7474) and try:

```cypher
// Count all nodes
MATCH (n) RETURN count(n)

// View all entities
MATCH (e:Entity) RETURN e LIMIT 25

// Find Gandalf's relationships
MATCH (g:Entity {slug: 'gandalf'})-[r]-(related)
RETURN g, r, related

// Events in Third Age
MATCH (e:Event)-[:OCCURS_DURING]->(t:TimeRef {age: 'TA'})
RETURN e, t
ORDER BY t.sortKey
```

## Getting Help

- Check [README.md](./README.md) for full documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for Railway deployment
- Review Neo4j schema in `packages/shared/src/schema/schema.md`

---

**Happy exploring! 🧙‍♂️**

