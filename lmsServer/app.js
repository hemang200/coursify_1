// app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import userRoutes from './routes/user.routes.js';
import courseRoutes from './routes/course.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
import miscellaneousRoutes from './routes/miscellaneous.routes.js';
import morgan from 'morgan';
import connectDB from './config/dbConnection.js';
import cloudinary from 'cloudinary';
import Razorpay from 'razorpay';

config(); // Load env

// Connect DB (can stay here for cold starts)
connectDB();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (req, res) => res.send('Server is running'));
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1', miscellaneousRoutes);
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.all('*', (req, res) => {
  res.status(404).send('OOPS! This route does not exist');
});

app.use(errorMiddleware);

export default app;

