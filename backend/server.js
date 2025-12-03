import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import transactionRoutes from './routes/transactions.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.status(200).send('API Server is Operational. Use the /api endpoint for transaction data.');
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

export default app; 