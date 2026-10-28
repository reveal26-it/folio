import * as SQLite from 'expo-sqlite';
import { DDL } from './schema';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('folio.db');
      await db.execAsync(DDL);
      return db;
    })();
  }
  return dbPromise;
}