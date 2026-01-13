import neo4j, { Driver, Session, Result } from 'neo4j-driver';

export class Neo4jClient {
  private driver: Driver | null = null;

  constructor(
    private uri: string,
    private user: string,
    private password: string
  ) {}

  async connect(): Promise<void> {
    try {
      this.driver = neo4j.driver(this.uri, neo4j.auth.basic(this.user, this.password));
      await this.driver.verifyConnectivity();
      console.log('Connected to Neo4j successfully');
    } catch (error) {
      console.error('Failed to connect to Neo4j:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.driver) {
      await this.driver.close();
      this.driver = null;
      console.log('Disconnected from Neo4j');
    }
  }

  getSession(database?: string): Session {
    if (!this.driver) {
      throw new Error('Neo4j driver not connected. Call connect() first.');
    }
    return this.driver.session({ database });
  }

  async executeQuery(query: string, params: Record<string, any> = {}): Promise<Result> {
    const session = this.getSession();
    try {
      const result = await session.run(query, params);
      return result;
    } finally {
      await session.close();
    }
  }

  async executeWrite(query: string, params: Record<string, any> = {}): Promise<Result> {
    const session = this.getSession();
    try {
      const result = await session.executeWrite((tx) => tx.run(query, params));
      return result;
    } finally {
      await session.close();
    }
  }

  async executeRead(query: string, params: Record<string, any> = {}): Promise<Result> {
    const session = this.getSession();
    try {
      const result = await session.executeRead((tx) => tx.run(query, params));
      return result;
    } finally {
      await session.close();
    }
  }

  async runTransaction<T>(
    fn: (session: Session) => Promise<T>,
    database?: string
  ): Promise<T> {
    const session = this.getSession(database);
    try {
      return await fn(session);
    } finally {
      await session.close();
    }
  }

  isConnected(): boolean {
    return this.driver !== null;
  }
}

// Singleton instance
let clientInstance: Neo4jClient | null = null;

export function getNeo4jClient(): Neo4jClient {
  if (!clientInstance) {
    const uri = process.env.NEO4J_URI || 'neo4j://localhost:7687';
    const user = process.env.NEO4J_USER || 'neo4j';
    const password = process.env.NEO4J_PASSWORD || 'password';
    clientInstance = new Neo4jClient(uri, user, password);
  }
  return clientInstance;
}

export async function initializeNeo4j(): Promise<Neo4jClient> {
  const client = getNeo4jClient();
  if (!client.isConnected()) {
    await client.connect();
  }
  return client;
}

