# 🚀 Local Development Setup

## Prerequisites

1. **Node.js** 18+ and **pnpm** 8+
2. **Neo4j Desktop** installed and running

## Quick Start

### 1. Install Neo4j Desktop

Download from: https://neo4j.com/download/

### 2. Create Neo4j Database

1. Open Neo4j Desktop
2. Click **"Create Instance"** (or **"Add"** → **"Local DBMS"**)
3. Fill in:
   - **Instance name**: `ArdaGraph`
   - **Neo4j version**: Latest (e.g., 2025.11.2)
   - **Database user**: `neo4j`
   - **Password**: `ardagraph123`
4. Click **"Create"**
5. Click **▶️ Start** to start the database
6. Wait until it shows **"Running"**

### 3. Install Dependencies

```bash
cd /Users/dom/workspace/ArdaGraph
pnpm install
```

### 4. Build Shared Package

```bash
pnpm --filter shared build
```

### 5. Ingest Seed Data

```bash
pnpm ingest
```

You should see:
```
✓ Works:         3
✓ Entities:      19
✓ Events:        8
✓ Relationships: 34

✨ Ingestion completed successfully!
```

### 6. Start Development Servers

```bash
pnpm dev
```

This starts:
- **GraphQL API**: http://localhost:4000/graphql
- **Next.js Web App**: http://localhost:3000 (or 3001 if 3000 is busy)

## Verify Setup

### Test the GraphQL API

Open http://localhost:4000/graphql in your browser and try this query:

```graphql
query {
  entities(limit: 5) {
    id
    name
    type
    summary
  }
}
```

### Browse the Web App

Open http://localhost:3000 and:
- Click **"Browse"** to see all entities
- Click on any entity to see its details and relationship graph
- Try the search bar (note: search is simplified in MVP)

## Troubleshooting

### Neo4j Connection Issues

If you get authentication errors:
1. Make sure the database is **Running** in Neo4j Desktop
2. Verify the connection details:
   - Open Neo4j Desktop
   - Click on your database
   - Check the **Connection URI** (should be `neo4j://127.0.0.1:7687`)
3. If the password is different, update `package.json`:
   ```json
   "ingest": "NEO4J_URI=neo4j://127.0.0.1:7687 NEO4J_USER=neo4j NEO4J_PASSWORD=YOUR_PASSWORD pnpm --filter ingest start"
   ```

### Port Already in Use

If port 3000 or 4000 is busy:
- Next.js will automatically use 3001 if 3000 is taken
- For the API, stop the process using port 4000 or change `GRAPHQL_PORT` in the API package

### Ingestion Fails

If data ingestion fails:
1. Verify Neo4j is running
2. Check the Neo4j Browser at http://localhost:7474
3. Try to connect with username `neo4j` and password `ardagraph123`
4. If the connection works but ingestion still fails, rebuild shared package:
   ```bash
   pnpm --filter shared build && pnpm ingest
   ```

## Project Structure

```
ArdaGraph/
├── apps/
│   ├── api/          # GraphQL API (Apollo Server + Neo4j)
│   └── web/          # Next.js 14 frontend
├── packages/
│   └── shared/       # Shared types, Neo4j client, queries
├── scripts/
│   └── ingest/       # Data ingestion ETL pipeline
└── data/
    └── seed/         # JSON seed data files
```

## Next Steps

- Explore the data in Neo4j Browser: http://localhost:7474
- Check out the GraphQL schema at http://localhost:4000/graphql
- Add more entities, events, and relationships in `data/seed/`
- Run `pnpm ingest` again to update the database

## Need Help?

- Check the main [README.md](./README.md)
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for Railway deployment instructions
- Check [QUICKSTART.md](./QUICKSTART.md) for more details

