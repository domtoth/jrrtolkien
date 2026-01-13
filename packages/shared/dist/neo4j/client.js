"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neo4jClient = void 0;
exports.getNeo4jClient = getNeo4jClient;
exports.initializeNeo4j = initializeNeo4j;
const neo4j_driver_1 = __importDefault(require("neo4j-driver"));
class Neo4jClient {
    constructor(uri, user, password) {
        this.uri = uri;
        this.user = user;
        this.password = password;
        this.driver = null;
    }
    async connect() {
        try {
            this.driver = neo4j_driver_1.default.driver(this.uri, neo4j_driver_1.default.auth.basic(this.user, this.password));
            await this.driver.verifyConnectivity();
            console.log('Connected to Neo4j successfully');
        }
        catch (error) {
            console.error('Failed to connect to Neo4j:', error);
            throw error;
        }
    }
    async disconnect() {
        if (this.driver) {
            await this.driver.close();
            this.driver = null;
            console.log('Disconnected from Neo4j');
        }
    }
    getSession(database) {
        if (!this.driver) {
            throw new Error('Neo4j driver not connected. Call connect() first.');
        }
        return this.driver.session({ database });
    }
    async executeQuery(query, params = {}) {
        const session = this.getSession();
        try {
            const result = await session.run(query, params);
            return result;
        }
        finally {
            await session.close();
        }
    }
    async executeWrite(query, params = {}) {
        const session = this.getSession();
        try {
            const result = await session.executeWrite((tx) => tx.run(query, params));
            return result;
        }
        finally {
            await session.close();
        }
    }
    async executeRead(query, params = {}) {
        const session = this.getSession();
        try {
            const result = await session.executeRead((tx) => tx.run(query, params));
            return result;
        }
        finally {
            await session.close();
        }
    }
    async runTransaction(fn, database) {
        const session = this.getSession(database);
        try {
            return await fn(session);
        }
        finally {
            await session.close();
        }
    }
    isConnected() {
        return this.driver !== null;
    }
}
exports.Neo4jClient = Neo4jClient;
// Singleton instance
let clientInstance = null;
function getNeo4jClient() {
    if (!clientInstance) {
        const uri = process.env.NEO4J_URI || 'neo4j://localhost:7687';
        const user = process.env.NEO4J_USER || 'neo4j';
        const password = process.env.NEO4J_PASSWORD || 'password';
        clientInstance = new Neo4jClient(uri, user, password);
    }
    return clientInstance;
}
async function initializeNeo4j() {
    const client = getNeo4jClient();
    if (!client.isConnected()) {
        await client.connect();
    }
    return client;
}
//# sourceMappingURL=client.js.map