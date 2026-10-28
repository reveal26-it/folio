import { getDb } from '../db/client';
import type { Book, TextNode, WordToken } from './types';

export async function listBooks(): Promise<Book[]> {
  const db = await getDb();
  return db.getAllAsync<Book>(`SELECT * FROM book ORDER BY downloadedAt DESC`);
}

export async function getBook(bookId: string): Promise<Book | null> {
  const db = await getDb();
  return (await db.getFirstAsync<Book>(`SELECT * FROM book WHERE id = ?`, [bookId])) ?? null;
}

export async function listNodes(bookId: string): Promise<TextNode[]> {
  const db = await getDb();
  return db.getAllAsync<TextNode>(
    `SELECT * FROM text_node WHERE bookId = ? AND type IN ('verse','para') ORDER BY orderIndex ASC`,
    [bookId],
  );
}

export async function tokensForNode(nodeId: string): Promise<WordToken[]> {
  const db = await getDb();
  return db.getAllAsync<WordToken>(
    `SELECT * FROM word_token WHERE nodeId = ? ORDER BY posInNode ASC`,
    [nodeId],
  );
}

export async function saveCheckpoint(bookId: string, nodeId: string, wordPos: number) {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO checkpoint (bookId, nodeId, wordPos, updatedAt) VALUES (?, ?, ?, ?)
     ON CONFLICT(bookId) DO UPDATE SET nodeId=excluded.nodeId, wordPos=excluded.wordPos, updatedAt=excluded.updatedAt`,
    [bookId, nodeId, wordPos, Date.now()],
  );
}

export async function getCheckpoint(bookId: string) {
  const db = await getDb();
  return db.getFirstAsync<{ nodeId: string; wordPos: number }>(
    `SELECT nodeId, wordPos FROM checkpoint WHERE bookId = ?`,
    [bookId],
  );
}