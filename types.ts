export type NodeType = 'book' | 'chapter' | 'verse' | 'para' | 'section';

export interface Book {
  id: string;
  title: string;
  author?: string;
  language: string;
  structure: 'bible' | 'chapters' | 'flat';
  sourceUrl?: string;
  license?: string;
  downloadedAt?: number;
  wordCount: number;
}

export interface TextNode {
  id: string;
  bookId: string;
  parentId?: string;
  type: NodeType;
  orderIndex: number;
  ref?: string;
  text: string;
  wordCount: number;
}

export interface WordToken {
  id: number;
  bookId: string;
  nodeId: string;
  posInNode: number;
  charStart: number;
  charEnd: number;
  surface: string;
  normalized: string;
}

export interface ConcordanceHit {
  nodeId: string;
  posInNode: number;
  ref?: string;
  context: string;
}

export interface ImportPayload {
  meta: { id: string; title: string; author?: string; language?: string; structure: 'bible' | 'chapters' | 'flat'; license?: string };
  nodes: Array<{ id: string; type: NodeType; parentId?: string; order: number; ref?: string; text: string }>;
}