const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory task storage (exported for test resets)
let tasks = [];
let nextId = 1;
const VALID_PRIORITIES = ['low', 'medium', 'high'];

function resetTasks() {
  tasks = [];
  nextId = 1;
}

// GET all tasks (with optional filters: ?completed=true&search=keyword)
app.get('/tasks', (req, res) => {
  let result = tasks;

  // Filter by completion status
  if (req.query.completed !== undefined) {
    const isCompleted = req.query.completed === 'true';
    result = result.filter(t => t.completed === isCompleted);
  }

  // Search by title
  if (req.query.search) {
    const search = req.query.search.toLowerCase();
    result = result.filter(t => t.title.toLowerCase().includes(search));
  }

  res.json(result);
});

// GET a single task by ID
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// POST create a new task
app.post('/tasks', (req, res) => {
  const { title, description, priority } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: 'Priority must be low, medium, or high' });
  }

  const task = {
    id: nextId++,
    title,
    description: description || '',
    priority: priority || 'medium',
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(task);
  res.status(201).json(task);
});

// PUT update a task
app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const { title, description, completed, priority } = req.body;
  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: 'Priority must be low, medium, or high' });
  }
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (completed !== undefined) task.completed = completed;
  if (priority !== undefined) task.priority = priority;

  res.json(task);
});

// DELETE a task
app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  tasks.splice(index, 1);
  res.status(204).send();
});

// Only start server if run directly (not imported by tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Task Tracker API running on http://localhost:${PORT}`);
  });
}

module.exports = { app, resetTasks };
