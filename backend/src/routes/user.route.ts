import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { fetchAllUsers, createUser } from '../controller/user.controller';

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal Server error
 */
router.get('/', fetchAllUsers);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       409:
 *          description: Email already exists
 *       500:
 *         description: Internal Server error
 */
router.post(
  '/',
  [
    body('firstName')
      .isAlpha()
      .isLength({ max: 100 })
      .withMessage('First name must contain only letters and be max 100 characters'),
    body('lastName')
      .isAlpha()
      .isLength({ max: 100 })
      .withMessage('Last name must contain only letters and be max 100 characters'),
    body('email')
      .isEmail()
      .withMessage('Must be a valid email address'),
  ],
  createUser
);

const userRoutes = router;
export default userRoutes;