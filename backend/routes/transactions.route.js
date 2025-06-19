import authMiddleware from "../middleware/auth.middleware.js";
import express from 'express';

import { authorizeRoles } from "../middleware/authrole.middleware.js";
import { getRecentTransactions } from "../controller/transaction.controller.js";

const transactionRouter =  express.Router();

transactionRouter.use(authMiddleware);

transactionRouter.get('/recent-transactions',authorizeRoles("lender","borrower"),getRecentTransactions)

export default transactionRouter

