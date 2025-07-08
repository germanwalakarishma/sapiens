import { Request, Response, RequestHandler, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/user.model';
import { USER_SAVED_SUCCESSFULLY } from '../constants/user.constant';

export const fetchAllUsers = async(req: Request, res: Response) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { firstName, lastName, email } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: 'Email address already in use' }); // 409 Conflict
      return;
    }

    const newUser = new User({ firstName, lastName, email });
    await newUser.save();

    res.status(201).json({ message: USER_SAVED_SUCCESSFULLY, user: newUser });
  } catch (error) {
    next(error);
  }
};