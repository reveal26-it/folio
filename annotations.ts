import { getDb } from '../db/client';

export type AnnotationType = 'highlight' | 'note' | 'notable';
export type Visibility = 'private' | 'friends' | 'crowd';

export interface AnnotationRow {
  id: string;
  bookId: string;
  nodeId: string;
  startWord: number;
  endWord: number;
  type: AnnotationType;
  body: string | null;
  visibility: Visibility;
  createdAt: number;
  updatedAt: number;
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function addAnnotation(input: {
  bookId: string; nodeId: string; startWord: number; endWord: number;
  type: AnnotationType; body?: string | null; visibility?: Visibility;
}): Promise<string> {
  const db = await getDb();
  const id = uid();
  const now = Date.now();
  await db.runAsync(
    `INSERT INTO annotation (id, bookId, nodeId, startWord, endWord, type, body, visibility, createdAt, updatedAt, synced)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [id, input.bookId, input.nodeId, input.startWord, input.endWord,
     input.type, input.body ?? null, input.visibility ?? 'private', now, now],
  );
  return id;
}

export async function annotationsForNode(nodeId: string): Promise<AnnotationRow[]> {
  const db = await getDb();
  return db.getAllAsync<AnnotationRow>(
    `SELECT id, bookId, nodeId, startWord, endWord, type, body, visibility, createdAt, updatedAt
       FROM annotation WHERE nodeId = ? ORDER BY startWord ASC`,
    [nodeId],
  );
}