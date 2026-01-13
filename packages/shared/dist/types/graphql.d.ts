import { EntityType } from './entity';
export interface SearchResult {
    id: string;
    slug: string;
    name: string;
    type: EntityType;
    snippet?: string;
    score?: number;
}
export interface GraphNode {
    id: string;
    slug: string;
    name: string;
    type: EntityType;
    summary?: string;
}
export interface GraphEdge {
    id: string;
    from: string;
    to: string;
    predicate: string;
    type: string;
}
export interface GraphData {
    nodes: GraphNode[];
    edges: GraphEdge[];
    centerNode: string;
}
export interface PathResult {
    nodes: GraphNode[];
    edges: GraphEdge[];
    totalHops: number;
}
export interface TimeInput {
    age?: string;
    yearFrom?: number;
    yearTo?: number;
}
//# sourceMappingURL=graphql.d.ts.map