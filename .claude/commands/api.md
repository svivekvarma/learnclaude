# API Test

Run a comprehensive API test against the running server at http://localhost:3000.

Steps:
1. Verify the server is running with a GET to /tasks. If not running, start it.
2. Run through all endpoints with curl and display formatted results:

   a. **POST /tasks** - Create a test task with all fields (title, description, priority, dueDate)
   b. **GET /tasks** - List all tasks
   c. **GET /tasks/:id** - Get the task we just created by ID
   d. **GET /tasks?search=test** - Test search filtering
   e. **GET /tasks?completed=false** - Test completion filtering
   f. **PUT /tasks/:id** - Update the task (change title, mark completed)
   g. **GET /tasks/:id** - Verify the update
   h. **DELETE /tasks/:id** - Delete the task
   i. **GET /tasks/:id** - Verify 404 after deletion
   j. **POST /tasks** - Test validation (missing title, expect 400)

3. Show a summary: endpoints tested, passed, failed.
4. Clean up any test tasks created during the run.

Format output clearly with status codes and response bodies.
