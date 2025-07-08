import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import userRoutes from './routes/user.route';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('Missing MONGO_URI in .env');
}

mongoose.connect(uri)
   .then(() => console.log('Connected to MongoDB Atlas'))
   .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express + Typescript + MongoDB Atlas using ES Modules!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));