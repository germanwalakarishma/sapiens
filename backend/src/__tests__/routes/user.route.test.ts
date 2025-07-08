import request from 'supertest';
import express from 'express';
import userRoutes from '../../routes/user.route';
import User from '../../models/user.model';

jest.mock('../../models/user.model');
const mockUser = User as jest.Mocked<typeof User>;

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('should return empty array when no users', async () => {
      mockUser.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([])
      } as any);

      const response = await request(app).get('/api/users');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    }, 10000);

    it('should return all users', async () => {
      const users = [{ firstName: 'John', lastName: 'Doe', email: 'john@test.com' }];
      mockUser.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(users)
      } as any);
      
      const response = await request(app).get('/api/users');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].firstName).toBe('John');
    }, 10000);
  });

  describe('POST /api/users', () => {
    const validUser = { firstName: 'John', lastName: 'Doe', email: 'john@test.com' };

    it('should create user with valid data', async () => {
      mockUser.findOne.mockResolvedValue(null);
      mockUser.prototype.save = jest.fn().mockResolvedValue(validUser);

      const response = await request(app)
        .post('/api/users')
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User saved successfully');
    }, 10000);

    it('should reject invalid firstName', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ ...validUser, firstName: 'John123' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    }, 10000);

    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ ...validUser, email: 'invalid-email' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    }, 10000);

    it('should reject duplicate email', async () => {
      mockUser.findOne.mockResolvedValue(validUser as any);
      
      const response = await request(app)
        .post('/api/users')
        .send(validUser);

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Email address already in use');
    }, 10000);
  });
});