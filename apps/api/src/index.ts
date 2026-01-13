import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeNeo4j } from 'shared';
import { createContext } from './context.js';
import { resolvers } from './resolvers/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer() {
  try {
    // Initialize Neo4j
    console.log('Connecting to Neo4j...');
    const neo4jClient = await initializeNeo4j();
    console.log('Connected to Neo4j successfully');

    // Read GraphQL schema
    const typeDefs = readFileSync(join(__dirname, 'schema/schema.graphql'), 'utf-8');

    // Create Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    await server.start();

    // Create Express app
    const app = express();
    const port = process.env.API_PORT || 4000;

    // Middleware
    app.use(
      '/graphql',
      cors<cors.CorsRequest>(),
      express.json(),
      expressMiddleware(server, {
        context: async () => createContext(neo4jClient),
      })
    );

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', service: 'ArdaGraph API' });
    });

    app.listen(port, () => {
      console.log(`🚀 GraphQL API server running at http://localhost:${port}/graphql`);
      console.log(`   Health check: http://localhost:${port}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

