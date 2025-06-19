import authMiddleware from "../middleware/auth.middleware.js";
import express from "express";

import {updateRepayment,getLoanRepayments,addRepayment,deleteRepayment,getLoanRepaymentsHistory,
}from "../controller/repayment.controller.js";

import { authorizeRoles } from "../middleware/authrole.middleware.js";

const repaymentRouter = express.Router();
repaymentRouter.use(authMiddleware);


repaymentRouter.get('/:loanId',authorizeRoles('lender'), getLoanRepayments); // Get repayments for a loan
repaymentRouter.get('/:loanId/history',authorizeRoles('lender'), getLoanRepaymentsHistory); // Get repayment history for a loan

repaymentRouter.post('/:loanId',authorizeRoles('borrower'), addRepayment); // Add repayment to a loan
repaymentRouter.put('/:loanId/:paymentId',authorizeRoles('borrower'), updateRepayment); // Update repayment for a loan
repaymentRouter.delete('/:loanId/:paymentId',authorizeRoles('borrower'), deleteRepayment); // Delete repayment from a loan

export default repaymentRouter;