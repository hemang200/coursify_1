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
config();

const app = express();

app.use(express.json());
app.use(cors({
  // origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  origin: [
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
}));

app.use(cookieParser());

app.use(morgan('dev'));

app.get('/', (req, res) => res.send('server is running'));

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1', miscellaneousRoutes);

app.all('*', (req, res) => {
    res.status(404).send('OOPS! This route does not exist');
});

app.use(errorMiddleware);

export default app;