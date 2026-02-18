const express = require('express');
const path = require('path');
const { createDb, defaultDbPath } = require('./db');

const app = express();
const PORT = 3000;
const VALID_PRIORITIES = ['low', 'medium', 'high'];

// Database - can be overridden for tests via initApp()
let db = null;

function initApp(dbPath) {
  db = createDb(dbPath || defaultDbPath);
  return app;
}

function resetTasks() {
  if (db) {
    db.exec('DELETE FROM tasks');
  }
}

function getDb() {
  return db;
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper: convert DB row (completed as 0/1) to API format (completed as boolean)
function formatTask(row) {
  return { ...row, completed: row.completed === 1 };
}

// GET all tasks (with optional filters: ?completed=true&search=keyword)
app.get('/tasks', (req, res) => {
  let sql = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];

  if (req.query.completed !== undefined) {
    sql += ' AND completed = ?';
    params.push(req.query.completed === 'true' ? 1 : 0);
  }

  if (req.query.search) {
    sql += ' AND title LIKE ?';
    params.push(`%${req.query.search}%`);
  }

  sql += ' ORDER BY id ASC';

  const tasks = db.prepare(sql).all(...params);
  res.json(tasks.map(formatTask));
});

// GET a single task by ID
app.get('/tasks/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(formatTask(task));
});

// POST create a new task
app.post('/tasks', (req, res) => {
  const { title, description, priority } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: 'Priority must be low, medium, or high' });
  }

  const createdAt = new Date().toISOString();
  const result = db.prepare(
    'INSERT INTO tasks (title, description, priority, completed, createdAt) VALUES (?, ?, ?, 0, ?)'
  ).run(title, description || '', priority || 'medium', createdAt);

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(formatTask(task));
});

// PUT update a task
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });

  const { title, description, completed, priority } = req.body;
  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: 'Priority must be low, medium, or high' });
  }

  const updates = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (completed !== undefined) updates.completed = completed ? 1 : 0;
  if (priority !== undefined) updates.priority = priority;

  if (Object.keys(updates).length > 0) {
    const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = Object.values(updates);
    db.prepare(`UPDATE tasks SET ${setClauses} WHERE id = ?`).run(...values, id);
  }

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.json(formatTask(task));
});

// DELETE a task
app.delete('/tasks/:id', (req, res) => {
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(parseInt(req.params.id));
  if (result.changes === 0) return res.status(404).json({ error: 'Task not found' });
  res.status(204).send();
});

// Only start server if run directly (not imported by tests)
if (require.main === module) {
  initApp();
  app.listen(PORT, () => {
    console.log(`Task Tracker API running on http://localhost:${PORT}`);
  });
}

module.exports = { app, initApp, resetTasks, getDb };
