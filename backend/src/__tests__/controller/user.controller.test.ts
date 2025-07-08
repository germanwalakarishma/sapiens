import { Request, Response, NextFunction } from 'express';
import { fetchAllUsers, createUser } from '../../controller/user.controller';
import User from '../../models/user.model';
import { validationResult } from 'express-validator';

jest.mock('../../models/user.model');
jest.mock('express-validator');

const mockUser = User as jest.Mocked<typeof User>;
const mockValidationResult = validationResult as jest.MockedFunction<typeof validationResult>;

describe('User Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('fetchAllUsers', () => {
    it('should return all users', async () => {
      const users = [{ firstName: 'John', lastName: 'Doe', email: 'john@test.com' }];
      mockUser.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(users)
      } as any);

      await fetchAllUsers(mockReq as Request, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith(users);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      mockUser.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(error)
      } as any);

      await fetchAllUsers(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('createUser', () => {
    beforeEach(() => {
      mockReq.body = { firstName: 'John', lastName: 'Doe', email: 'john@test.com' };
    });

    it('should create user successfully', async () => {
      mockValidationResult.mockReturnValue({ isEmpty: () => true } as any);
      mockUser.findOne.mockResolvedValue(null);
      const savedUser = { firstName: 'John', lastName: 'Doe', email: 'john@test.com' };
      mockUser.prototype.save = jest.fn().mockResolvedValue(savedUser);

      await createUser(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User saved successfully',
        user: expect.any(Object)
      });
    });

    it('should return validation errors', async () => {
      const errors = [{ msg: 'Invalid email' }];
      mockValidationResult.mockReturnValue({ 
        isEmpty: () => false, 
        array: () => errors 
      } as any);

      await createUser(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ errors });
    });

    it('should return error for duplicate email', async () => {
      mockValidationResult.mockReturnValue({ isEmpty: () => true } as any);
      mockUser.findOne.mockResolvedValue({ email: 'john@test.com' } as any);

      await createUser(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Email address already in use' });
    });
  });
});