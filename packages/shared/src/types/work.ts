export enum WorkType {
  NOVEL = 'NOVEL',
  COLLECTION = 'COLLECTION',
  POETRY = 'POETRY',
  ESSAY = 'ESSAY',
  LETTER = 'LETTER',
}

export interface Work {
  id: string;
  slug: string;
  title: string;
  workType: WorkType;
  publicationYear?: number;
  summary?: string;
  author?: string;
}

export interface Section {
  id: string;
  slug: string;
  title: string;
  workId: string;
  ordinal?: number;
  summary?: string;
}

