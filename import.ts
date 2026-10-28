import type { SQLiteDatabase } from 'expo-sqlite';
import { tokenize } from './tokenize';
import type { ImportPayload } from './types';

export async function importBookFromPayload(
  db: SQLiteDatabase,
  payload: ImportPayload,
): Promise<void> {
  const { meta, nodes } = payload;

  let totalWords = 0;
  for (const n of nodes) totalWords += tokenize(n.text).length;

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT OR REPLACE INTO book (id, title, author, language, structure, license, downloadedAt, wordCount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [meta.id, meta.title, meta.author ?? null, meta.language ?? 'en',
       meta.structure, meta.license ?? null, Date.now(), totalWords],
    );

    for (const n of nodes) {
      const tokens = tokenize(n.text);
      await db.runAsync(
        `INSERT OR REPLACE INTO text_node (id, bookId, parentId, type, orderIndex, ref, text, wordCount)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [n.id, meta.id, n.parentId ?? null, n.type, n.order, n.ref ?? null, n.text, tokens.length],
      );
      for (const t of tokens) {
        await db.runAsync(
          `INSERT INTO word_token (bookId, nodeId, posInNode, charStart, charEnd, surface, normalized)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [meta.id, n.id, t.posInNode, t.charStart, t.charEnd, t.surface, t.normalized],
        );
        await db.runAsync(
          `INSERT INTO word_fts (normalized, nodeId, posInNode) VALUES (?, ?, ?)`,
          [t.normalized, n.id, t.posInNode],
        );
      }
    }
  });
}