export declare enum EventType {
    BATTLE = "BATTLE",
    COUNCIL = "COUNCIL",
    JOURNEY = "JOURNEY",
    BIRTH = "BIRTH",
    DEATH = "DEATH",
    MEETING = "MEETING",
    OTHER = "OTHER"
}
export declare enum Age {
    FA = "FA",// First Age
    SA = "SA",// Second Age
    TA = "TA",// Third Age
    FO = "FO",// Fourth Age
    OTHER = "OTHER",
    UNKNOWN = "UNKNOWN"
}
export interface TimeRef {
    id: string;
    age: Age;
    year?: number;
    sortKey: number;
    display: string;
}
export interface Event {
    id: string;
    slug: string;
    name: string;
    eventType: EventType;
    summary?: string;
    timeRef?: TimeRef;
    participants?: EventParticipant[];
}
export interface EventParticipant {
    entityId: string;
    entityName: string;
    entitySlug: string;
    role?: string;
}
//# sourceMappingURL=event.d.ts.map