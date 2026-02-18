# CLAUDE.md - Project Instructions

## Project
Task Tracker - Full-stack Express + SQLite + vanilla JS app.

## Architecture
- `index.js` - Express API server with all routes
- `db.js` - SQLite database module with schema and migrations
- `public/` - Static frontend (index.html, app.js, style.css)
- `index.test.js` - Jest + supertest tests using in-memory SQLite

## Key Patterns
- Use `initApp(dbPath)` to initialize the database connection
- Tests use `:memory:` SQLite for speed and isolation
- DB migrations use PRAGMA table_info to check for missing columns
- `formatTask()` converts SQLite integers to booleans for the API
- Always use dynamic IDs in tests (not hardcoded)

## Commands
- `npm start` - Start the server on port 3000
- `npm test` - Run Jest test suite

## Custom Skills (slash commands)
- `/dev` - Start dev server, verify it's working, open browser
- `/ship` - Test → commit → push (full shipping pipeline)
- `/feature <description>` - Plan, implement, test, and ship a feature end-to-end
- `/migrate <field description>` - Add a new field to tasks (DB + API + frontend + tests)
- `/api` - Run comprehensive API tests against the running server
- `/review` - Code review for security, bugs, performance, coverage
- `/docs` - Sync README.md with current code
- `/resetdb` - Delete database and restart fresh

## Conventions
- Validate enum fields (priority, etc.) against constant arrays
- Null means "not set" for optional fields (dueDate, etc.)
- Frontend uses escapeHtml() for XSS prevention
- Commit messages explain the "why", not just the "what"
