export const SCHEMA_VERSION = 1;

export const DDL = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- Drawer 1: books
CREATE TABLE IF NOT EXISTS book (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  author        TEXT,
  language      TEXT NOT NULL,
  structure     TEXT NOT NULL,
  sourceUrl     TEXT,
  license       TEXT,
  downloadedAt  INTEGER,
  wordCount     INTEGER DEFAULT 0
);

-- Drawer 2: pieces of text (verses, paragraphs, sections)
CREATE TABLE IF NOT EXISTS text_node (
  id            TEXT PRIMARY KEY,
  bookId        TEXT NOT NULL REFERENCES book(id) ON DELETE CASCADE,
  parentId      TEXT,
  type          TEXT NOT NULL,
  orderIndex    INTEGER NOT NULL,
  ref           TEXT,
  text          TEXT NOT NULL,
  wordCount     INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_node_book_order ON text_node(bookId, orderIndex);

-- Drawer 3: every word, with its position
CREATE TABLE IF NOT EXISTS word_token (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  bookId        TEXT NOT NULL,
  nodeId        TEXT NOT NULL REFERENCES text_node(id) ON DELETE CASCADE,
  posInNode     INTEGER NOT NULL,
  charStart     INTEGER NOT NULL,
  charEnd       INTEGER NOT NULL,
  surface       TEXT NOT NULL,
  normalized    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_word_node ON word_token(nodeId, posInNode);

-- Drawer 4: search index for concordance
CREATE VIRTUAL TABLE IF NOT EXISTS word_fts USING fts5(
  normalized,
  nodeId UNINDEXED,
  posInNode UNINDEXED,
  tokenize = 'unicode61'
);

-- Drawer 5: the reader's marks
CREATE TABLE IF NOT EXISTS annotation (
  id            TEXT PRIMARY KEY,
  bookId        TEXT NOT NULL,
  nodeId        TEXT NOT NULL,
  startWord     INTEGER NOT NULL,
  endWord       INTEGER NOT NULL,
  type          TEXT NOT NULL,
  body          TEXT,
  visibility    TEXT NOT NULL DEFAULT 'private',
  createdAt     INTEGER NOT NULL,
  updatedAt     INTEGER NOT NULL,
  synced        INTEGER NOT NULL DEFAULT 0
);

-- Drawer 6: the reader's bookmark
CREATE TABLE IF NOT EXISTS checkpoint (
  bookId        TEXT NOT NULL,
  nodeId        TEXT NOT NULL,
  wordPos       INTEGER NOT NULL,
  updatedAt     INTEGER NOT NULL,
  PRIMARY KEY (bookId)
);
`;