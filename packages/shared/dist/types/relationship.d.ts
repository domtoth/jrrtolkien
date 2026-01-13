export declare enum RelationshipType {
    RELATED_TO = "RELATED_TO",
    APPEARS_IN = "APPEARS_IN",
    ALIAS_OF = "ALIAS_OF",
    OCCURS_DURING = "OCCURS_DURING",
    PARTICIPATES_IN = "PARTICIPATES_IN"
}
export interface RelationshipData {
    type: RelationshipType;
    fromId: string;
    toId: string;
    predicate?: string;
    properties?: Record<string, any>;
}
//# sourceMappingURL=relationship.d.ts.map