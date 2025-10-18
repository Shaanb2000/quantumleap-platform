const request = require('supertest');
const app = require('./index');

describe('QuantumLeap API Tests', () => {
  let authToken;
  let userId;

  // Test health endpoint
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(res.body.status).toBe('OK');
    });
  });

  // Test authentication
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        interests: ['AI', 'Climate']
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(res.body.message).toBe('User registered successfully');
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(userData.email);
      
      authToken = res.body.token;
      userId = res.body.user.id;
    });

    it('should not register user with existing email', async () => {
      // First register a user
      const userData1 = {
        name: 'Test User 1',
        email: 'existing@example.com',
        password: 'password123',
        interests: ['AI']
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData1)
        .expect(201);

      // Try to register with same email
      const userData2 = {
        name: 'Test User 2',
        email: 'existing@example.com',
        password: 'password123',
        interests: ['AI']
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData2)
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // First register a user
      const userData = {
        name: 'Login Test User',
        email: 'login@example.com',
        password: 'password123',
        interests: ['AI']
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Now try to login
      const loginData = {
        email: 'login@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(res.body.message).toBe('Login successful');
      expect(res.body.token).toBeDefined();
    });

    it('should not login with invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);
    });
  });

  // Test projects
  describe('GET /api/projects', () => {
    it('should get all projects', async () => {
      const res = await request(app)
        .get('/api/projects')
        .expect(200);

      expect(res.body.projects).toBeDefined();
      expect(Array.isArray(res.body.projects)).toBe(true);
    });

    it('should filter projects by domain', async () => {
      const res = await request(app)
        .get('/api/projects?domain=AI')
        .expect(200);

      expect(res.body.projects).toBeDefined();
    });
  });

  // Test community
  describe('GET /api/community', () => {
    it('should get community posts', async () => {
      const res = await request(app)
        .get('/api/community')
        .expect(200);

      expect(res.body.posts).toBeDefined();
      expect(Array.isArray(res.body.posts)).toBe(true);
    });
  });

  // Test mentorship
  describe('GET /api/mentorship/mentors', () => {
    it('should get mentors', async () => {
      const res = await request(app)
        .get('/api/mentorship/mentors')
        .expect(200);

      expect(res.body.mentors).toBeDefined();
      expect(Array.isArray(res.body.mentors)).toBe(true);
    });
  });

  // Test AI suggestions
  describe('POST /api/ai/suggest', () => {
    it('should get AI suggestions', async () => {
      // First register a user and get token
      const userData = {
        name: 'AI Test User',
        email: 'ai@example.com',
        password: 'password123',
        interests: ['AI']
      };

      const registerRes = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const token = registerRes.body.token;

      const res = await request(app)
        .post('/api/ai/suggest')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'feedback',
          context: 'React project'
        })
        .expect(200);

      expect(res.body.suggestions).toBeDefined();
      expect(Array.isArray(res.body.suggestions)).toBe(true);
    });
  });

  // Test protected routes
  describe('GET /api/auth/me', () => {
    it('should get current user with valid token', async () => {
      // First register a user and get token
      const userData = {
        name: 'Me Test User',
        email: 'me@example.com',
        password: 'password123',
        interests: ['AI']
      };

      const registerRes = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const token = registerRes.body.token;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('me@example.com');
    });

    it('should not get user without token', async () => {
      await request(app)
        .get('/api/auth/me')
        .expect(401);
    });
  });
});

// Export for use in other test files
module.exports = { app };
