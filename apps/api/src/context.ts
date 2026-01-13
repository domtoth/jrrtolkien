import { Neo4jClient, Neo4jQueries, createQueries } from 'shared';

export interface Context {
  client: Neo4jClient;
  queries: Neo4jQueries;
}

export function createContext(client: Neo4jClient): Context {
  return {
    client,
    queries: createQueries(client),
  };
}

