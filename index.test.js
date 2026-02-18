const request = require('supertest');
const { app, initApp, resetTasks, getDb } = require('./index');

// Use in-memory SQLite for tests (fast, no file cleanup)
beforeAll(() => {
  initApp(':memory:');
});

beforeEach(() => {
  resetTasks();
});

afterAll(() => {
  const db = getDb();
  if (db) db.close();
});

describe('Task Tracker API', () => {

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'Test task', description: 'A test' });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Test task');
      expect(res.body.completed).toBe(false);
      expect(res.body.id).toBeDefined();
    });

    it('should reject a task without a title', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ description: 'No title here' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Title is required');
    });

    it('should default priority to medium', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'No priority set' });

      expect(res.body.priority).toBe('medium');
    });

    it('should accept a valid priority', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'Urgent', priority: 'high' });

      expect(res.status).toBe(201);
      expect(res.body.priority).toBe('high');
    });

    it('should reject an invalid priority', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'Bad priority', priority: 'urgent' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Priority must be low, medium, or high');
    });
  });

  describe('GET /tasks', () => {
    it('should return all tasks', async () => {
      await request(app).post('/tasks').send({ title: 'Task 1' });
      await request(app).post('/tasks').send({ title: 'Task 2' });

      const res = await request(app).get('/tasks');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it('should filter by search term', async () => {
      await request(app).post('/tasks').send({ title: 'Buy groceries' });
      await request(app).post('/tasks').send({ title: 'Walk the dog' });

      const res = await request(app).get('/tasks?search=groceries');
      expect(res.body).toHaveLength(1);
      expect(res.body[0].title).toBe('Buy groceries');
    });

    it('should filter by completion status', async () => {
      const t1 = await request(app).post('/tasks').send({ title: 'Done task' });
      await request(app).post('/tasks').send({ title: 'Pending task' });
      await request(app).put(`/tasks/${t1.body.id}`).send({ completed: true });

      const res = await request(app).get('/tasks?completed=true');
      expect(res.body).toHaveLength(1);
      expect(res.body[0].title).toBe('Done task');
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a single task', async () => {
      const created = await request(app).post('/tasks').send({ title: 'Find me' });

      const res = await request(app).get(`/tasks/${created.body.id}`);
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Find me');
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app).get('/tasks/999');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Task not found');
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update a task', async () => {
      const created = await request(app).post('/tasks').send({ title: 'Original' });

      const res = await request(app)
        .put(`/tasks/${created.body.id}`)
        .send({ title: 'Updated', completed: true });

      expect(res.body.title).toBe('Updated');
      expect(res.body.completed).toBe(true);
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app).put('/tasks/999').send({ title: 'Nope' });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', async () => {
      const created = await request(app).post('/tasks').send({ title: 'To delete' });

      const res = await request(app).delete(`/tasks/${created.body.id}`);
      expect(res.status).toBe(204);

      const list = await request(app).get('/tasks');
      expect(list.body).toHaveLength(0);
    });
  });
});
