import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { getDb } from '../db/client';
import { importBookFromPayload } from '../ledger/import';
import type { ImportPayload } from '../ledger/types';

let seeded = false;

export async function seedDevBibleOnce() {
  if (seeded) return;
  seeded = true;

  const db = await getDb();
  const existing = await db.getFirstAsync<{ id: string }>(
    `SELECT id FROM book WHERE id = ?`, ['web-sample']
  );
  if (existing) return;

  const asset = Asset.fromModule(require('../../assets/catalog/web-sample.json'));
  await asset.downloadAsync();
  const raw = await FileSystem.readAsStringAsync(asset.localUri!);
  const payload: ImportPayload = JSON.parse(raw);
  await importBookFromPayload(db, payload);
}