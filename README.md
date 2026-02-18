# Task Tracker

A full-stack task management app built with Express, SQLite, and vanilla JavaScript.

![Dark themed UI with task list, priority badges, and filters](https://img.shields.io/badge/theme-dark-0f172a)

## Features

- Create, update, complete, and delete tasks
- Priority levels (low, medium, high) with color-coded badges
- Search tasks by title
- Filter by status (all, active, completed)
- Live stats bar
- Data persists across server restarts (SQLite)

## Quick Start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List all tasks |
| GET | `/tasks/:id` | Get a single task |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

### Query Parameters

- `?search=keyword` - Filter tasks by title
- `?completed=true` - Filter by completion status

### Create a Task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "My task", "priority": "high"}'
```

### Task Object

```json
{
  "id": 1,
  "title": "My task",
  "description": "",
  "priority": "high",
  "completed": false,
  "createdAt": "2026-02-18T02:30:00.000Z"
}
```

## Running Tests

```bash
npm test
```

13 tests covering all CRUD operations, validation, search, and filtering. Tests use an in-memory SQLite database for speed and isolation.

## Tech Stack

- **Backend:** Express.js
- **Database:** SQLite (better-sqlite3)
- **Frontend:** Vanilla HTML/CSS/JS
- **Tests:** Jest + Supertest

## Project Structure

```
index.js          - Express API server and routes
db.js             - SQLite database module
index.test.js     - Test suite
public/
  index.html      - App shell
  style.css       - Dark theme styles
  app.js          - Frontend logic (fetch-based API client)
```

---

Built with [Claude Code](https://claude.ai/claude-code)
