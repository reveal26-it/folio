import { getDb } from '../db/client';
import type { ConcordanceHit } from './types';

export async function concordance(normalized: string, limit = 50): Promise<ConcordanceHit[]> {
  const db = await getDb();
  return db.getAllAsync<ConcordanceHit>(
    `SELECT f.nodeId AS nodeId, f.posInNode AS posInNode, n.ref AS ref, n.text AS context
       FROM word_fts f
       JOIN text_node n ON n.id = f.nodeId
      WHERE word_fts MATCH ?
      LIMIT ?`,
    [normalized, limit],
  );
}