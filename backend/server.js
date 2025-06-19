import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import './config/passport.js'; // Ensure passport is configured
import passport from 'passport';
import path from 'path';

import repaymentRouter from './routes/repayment.route.js';
import loanRouter from './routes/loan.route.js';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import transactionRouter from './routes/transactions.route.js';

import { startOverdueChecker } from './cron/checkOverdues.js';

dotenv.config();

const app = express();
const __dirname = path.resolve();


const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.CLIENT_URL
      : 'http://localhost:5173',
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

// API routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/loans', loanRouter);
app.use('/api/repayments', repaymentRouter);
app.use('/api/transactions', transactionRouter);

// Serve frontend static files
if(process.env.NODE_ENV ==="production"){
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    startOverdueChecker();
  });
});