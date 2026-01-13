import { Session, Result } from 'neo4j-driver';
export declare class Neo4jClient {
    private uri;
    private user;
    private password;
    private driver;
    constructor(uri: string, user: string, password: string);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getSession(database?: string): Session;
    executeQuery(query: string, params?: Record<string, any>): Promise<Result>;
    executeWrite(query: string, params?: Record<string, any>): Promise<Result>;
    executeRead(query: string, params?: Record<string, any>): Promise<Result>;
    runTransaction<T>(fn: (session: Session) => Promise<T>, database?: string): Promise<T>;
    isConnected(): boolean;
}
export declare function getNeo4jClient(): Neo4jClient;
export declare function initializeNeo4j(): Promise<Neo4jClient>;
//# sourceMappingURL=client.d.ts.map