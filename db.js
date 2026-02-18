const Database = require('better-sqlite3');
const path = require('path');

function createDb(dbPath) {
  const db = new Database(dbPath);

  // Enable WAL mode for better concurrent read performance
  db.pragma('journal_mode = WAL');

  // Create tasks table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      priority TEXT DEFAULT 'medium',
      completed INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL
    )
  `);

  return db;
}

const defaultDbPath = path.join(__dirname, 'tasks.db');

module.exports = { createDb, defaultDbPath };
