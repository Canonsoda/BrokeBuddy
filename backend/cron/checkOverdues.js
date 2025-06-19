import cron from 'node-cron';
import Loan from '../models/loan.model.js';
import {sendReminder} from '../utils/sendReminder.js';

export const startOverdueChecker = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running overdue repayment checker...');

    const today = new Date();

    try {
      const loans = await Loan.find({}).populate('borrower', 'emailId name');

      for (const loan of loans) {
        let updated = false;

        for (let repayment of loan.repaymentSchedule) {
          if (
            repayment.status === 'pending' &&
            repayment.dueDate < today &&
            repayment.amountPaid < repayment.amountDue
          ) {
            repayment.status = 'overdue';
            updated = true;
          
            await sendReminder(
                loan.borrower.emailId,
                loan.borrower.name,
                loan._id,
                repayment.amountDue- repayment.amountPaid,
                repayment.dueDate
            );
            }
    }

        if (updated) {
          await loan.save();
        }
      }

      console.log('Overdue repayment check completed successfully.');
    } catch (error) {
      console.error('Error during overdue check:', error.message);
    }
  });
};

