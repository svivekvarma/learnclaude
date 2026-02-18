# Reset Database

Reset the database and restart the server with a clean state.

Steps:
1. Kill any running node processes on port 3000.
2. Delete tasks.db, tasks.db-shm, and tasks.db-wal files if they exist.
3. Start the server with `node index.js` (this creates a fresh database).
4. Verify with a GET to /tasks (should return empty array).
5. Report: database reset, server running, ready to use.

Ask for confirmation before deleting the database file.
