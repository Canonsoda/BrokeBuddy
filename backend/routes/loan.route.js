import authMiddleware from '../middleware/auth.middleware.js';
import express from 'express';
import {
  getLoans, createLoan, updateLoanStatus, deleteLoan, getLoanById, updateLoan,
  getLoansByStatus, getLoansByUserId, getLoansByUserIdAndStatus,
  getLoanByBorrower, getLoanByLender, getLoanSummary,
  updateRepaymentScheduleManually, // ✅ NEW
} from '../controller/loan.controller.js';

import { authorizeRoles } from '../middleware/authrole.middleware.js';

const loanRouter = express.Router();
loanRouter.use(authMiddleware);

loanRouter.get('/', authorizeRoles('lender', 'borrower'), getLoans);
loanRouter.get('/summary', authorizeRoles('lender', 'borrower', 'both'), getLoanSummary);
loanRouter.get('/status/:status', authorizeRoles('lender'), getLoansByStatus);
loanRouter.get('/user/:userId/status/:status', authorizeRoles('lender'), getLoansByUserIdAndStatus);
loanRouter.get('/user/:userId', authorizeRoles('lender', 'borrower'), getLoansByUserId);
loanRouter.get('/borrower/:borrowerId', authorizeRoles('lender'), getLoanByBorrower);
loanRouter.get('/lender/:lenderId', authorizeRoles('lender', 'borrower'), getLoanByLender);
loanRouter.get('/:id', authorizeRoles('lender', 'borrower'), getLoanById); // LAST among GETs

loanRouter.post('/create', authorizeRoles('lender'), createLoan);
loanRouter.put('/:id/status', authorizeRoles('lender'), updateLoanStatus);
loanRouter.put('/:id', authorizeRoles('lender'), updateLoan);


loanRouter.put('/:id/edit-schedule', authorizeRoles('lender'), updateRepaymentScheduleManually);

loanRouter.delete('/:id', authorizeRoles('lender'), deleteLoan);

export default loanRouter;
