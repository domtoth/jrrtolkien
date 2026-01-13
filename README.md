# ArdaGraph

An interactive knowledge graph explorer for J.R.R. Tolkien's legendarium, built with Neo4j, GraphQL, and Next.js.

![ArdaGraph](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Neo4j](https://img.shields.io/badge/Neo4j-008CC1?style=for-the-badge&logo=neo4j&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)

## Features

- 🔍 **Full-text Search** - Find characters, places, and artifacts instantly
- 🕸️ **Interactive Graph Visualization** - Explore entity relationships visually
- 📚 **Rich Context** - Discover which works entities appear in
- 🎨 **Modern UI** - Built with Next.js 14 and TailwindCSS
- ⚡ **Fast** - Powered by Neo4j graph database
- 🚀 **Deployable** - Ready for Railway deployment

## Architecture

```
ArdaGraph/
├── apps/
│   ├── api/          # GraphQL API (Apollo Server + Neo4j)
│   └── web/          # Next.js 14 frontend
├── packages/
│   └── shared/       # Shared types and utilities
├── data/seed/        # JSON seed data
└── scripts/ingest/   # ETL pipeline
```

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TailwindCSS
- **Backend**: Node.js, TypeScript, GraphQL (Apollo Server)
- **Database**: Neo4j (graph database)
- **Graph Viz**: react-force-graph-2d
- **Monorepo**: pnpm workspaces
- **Deployment**: Railway

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Neo4j (local installation or Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ArdaGraph
   ```

2. **Install dependencies**
```bash
pnpm install
   ```

3. **Set up environment variables**
   ```bash
cp .env.example .env
   ```
   
   Edit `.env` with your Neo4j credentials:
   ```env
   NEO4J_URI=neo4j://localhost:7687
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=your-password
   API_PORT=4000
   NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
   ```

4. **Start Neo4j**
   
   **Option A: Docker**
   ```bash
   docker run \
     --name neo4j \
     -p 7474:7474 -p 7687:7687 \
     -e NEO4J_AUTH=neo4j/your-password \
     neo4j:5-community
   ```
   
   **Option B: Neo4j Desktop**
   - Download from https://neo4j.com/download
   - Create a new database
   - Start the database

5. **Load seed data**
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

6. **Start development servers**
   
   **Option A: Start both (recommended)**
   ```bash
pnpm dev
```

   **Option B: Start separately**
   ```bash
   # Terminal 1 - API
   pnpm dev:api
   
   # Terminal 2 - Web
   pnpm dev:web
   ```

7. **Open the app**
   - Web: http://localhost:3000
   - API: http://localhost:4000/graphql
   - Neo4j Browser: http://localhost:7474

## Development

### Project Scripts

```bash
# Development
pnpm dev              # Start both API and web
pnpm dev:api          # Start API only
pnpm dev:web          # Start web only

# Build
pnpm build            # Build all packages

# Data
pnpm ingest           # Load seed data into Neo4j

# Code quality
pnpm lint             # Run ESLint
pnpm format           # Format with Prettier
pnpm typecheck        # TypeScript type checking
```

### Adding New Data

1. **Edit seed files** in `data/seed/`:
   - `works.json` - Literary works
   - `entities.json` - Characters, places, artifacts, groups
   - `events.json` - Historical events
   - `relationships.json` - Connections between entities

2. **Re-run ingestion**:
   ```bash
pnpm ingest
```

### GraphQL API

The API runs on http://localhost:4000/graphql with the following queries:

```graphql
# Search entities
query {
  search(query: "Gandalf", limit: 10) {
    slug
    name
    type
    snippet
  }
}

# Get entity details
query {
  entity(slug: "gandalf") {
    name
    type
    summary
    aliases
    relationships {
      predicate
      targetName
      targetSlug
    }
  }
}

# Get entity graph
query {
  entityGraph(slug: "gandalf", depth: 1) {
    nodes {
      slug
      name
      type
    }
    edges {
      from
      to
      predicate
    }
  }
}
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Railway deployment instructions.

### Quick Deploy to Railway

1. Push code to GitHub
2. Create Railway project
3. Add Neo4j service from template
4. Add API service (root: `apps/api`)
5. Add Web service (root: `apps/web`)
6. Set environment variables
7. Run ingestion script
8. Visit your deployed app!

## Data Model

### Node Types

- **Entity**: Characters, places, artifacts, events, groups
- **Work**: Published works (novels, collections, etc.)
- **Event**: Historical events with time references
- **TimeRef**: Time periods (First Age, Second Age, Third Age)

### Relationships

- `RELATED_TO`: Generic relationship with predicate
- `APPEARS_IN`: Entity appears in a work
- `PARTICIPATES_IN`: Entity participates in an event
- `OCCURS_DURING`: Event occurs during a time period

### Sample Data

The project includes seed data with:
- 3 works (LOTR, The Hobbit, Silmarillion)
- 19 entities (Gandalf, Frodo, Aragorn, etc.)
- 8 events (Council of Elrond, Battle of Five Armies, etc.)
- 34 relationships

## Project Structure

```
ArdaGraph/
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── index.ts           # Apollo Server setup
│   │       ├── context.ts         # GraphQL context
│   │       ├── schema/
│   │       │   └── schema.graphql # GraphQL schema
│   │       └── resolvers/         # Query resolvers
│   │
│   └── web/
│       ├── app/
│       │   ├── components/        # React components
│       │   ├── entity/[slug]/     # Entity detail page
│       │   ├── browse/            # Browse page
│       │   └── about/             # About page
│       └── lib/
│           ├── apollo.ts          # Apollo Client
│           ├── types.ts           # TypeScript types
│           └── graphql/queries.ts # GraphQL queries
│
├── packages/
│   └── shared/
│       └── src/
│           ├── types/             # Shared TypeScript types
│           ├── schema/            # Neo4j schema (Cypher)
│           └── neo4j/             # Neo4j client & queries
│
├── data/seed/                     # JSON seed data
│   ├── works.json
│   ├── entities.json
│   ├── events.json
│   └── relationships.json
│
└── scripts/ingest/                # ETL pipeline
    └── src/
        ├── index.ts               # Main ingestion script
        ├── loaders.ts             # Load JSON files
        └── validators.ts          # Data validation
```

## Roadmap / Future Enhancements

- [ ] Timeline explorer with filters
- [ ] Connection path finder (shortest path)
- [ ] Advanced graph controls (depth 3+, timeframe filters)
- [ ] Claims & provenance system
- [ ] Work/Section browser
- [ ] Timeline visualizations (vis-timeline)
- [ ] Admin interface for data management
- [ ] Performance optimizations (caching, CDN)
- [ ] Comprehensive testing (unit + integration + E2E)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests if applicable
5. Submit a pull request

## License

MIT License - see [LICENSE](./LICENSE) for details

## Acknowledgments

- J.R.R. Tolkien for creating Middle-earth
- The Tolkien Estate
- Neo4j for the graph database
- The open-source community

## Disclaimer

This is a fan-made project for educational purposes. It is not affiliated with or endorsed by the Tolkien Estate or any official Tolkien entities. All content is presented as factual information and short summaries for reference purposes only.

---

**Made with ❤️ for Tolkien fans**
