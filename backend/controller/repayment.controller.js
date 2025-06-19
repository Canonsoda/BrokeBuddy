import Loan from '../models/loan.model.js';
import User from '../models/user.model.js';
import {repaymentNotification} from '../utils/sendRepayment.js';

// Helper: Update repayment schedule based on total repaid
const updateRepaymentSchedule = (loan) => {
    let remaining = loan.totalRepaid;
    for (let sched of loan.repaymentSchedule) {
        if (remaining >= sched.amountDue) {
            sched.amountPaid = sched.amountDue;
            sched.status = 'paid';
            remaining -= sched.amountDue;
        } else {
            sched.amountPaid = remaining;
            sched.status = remaining > 0 ? 'partial' : 'unpaid';
            remaining = 0;
        }
    }
};

export const addRepayment = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { amount, date = new Date() } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid repayment amount is required' });
    }

    const loan = await Loan.findById(loanId).populate('lender borrower');

    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    const borrowerId = loan.borrower?._id?.toString?.() || loan.borrower?.toString?.();

    if (borrowerId !== req.user.id) {
        return res.status(403).json({ message: 'Only the borrower can make repayments' });
    }

    const remaining = loan.totalAmount - loan.totalRepaid;
    if (remaining <= 0) {
      return res.status(400).json({ message: 'Loan is already fully repaid' });
    }

    if (amount > remaining) {
      return res.status(400).json({ message: `Repayment exceeds remaining amount (₹${remaining})` });
    }

    loan.repayments.push({ amount, date, user: req.user.id });
    loan.totalRepaid += amount;

    updateRepaymentSchedule(loan);

    if (loan.totalRepaid >= loan.totalAmount) {
      loan.status = 'completed';
    }

    await loan.save();

    await repaymentNotification(loan, amount, loanId, req);

    res.status(201).json({ message: 'Repayment recorded successfully', loan });
  } catch (error) {
    console.error("Repayment error:", error);
    res.status(500).json({ message: 'Error adding repayment', error: error.message });
  }
};


export const deleteRepayment = async (req, res) => {
    try {
        const { loanId, paymentId } = req.params;

        const loan = await Loan.findById(loanId);
        if (!loan) return res.status(404).json({ message: 'Loan not found' });

        const repayment = loan.repayments.id(paymentId);
        if (!repayment) return res.status(404).json({ message: 'Repayment not found' });

        if (
            repayment.user.toString() !== req.user.id &&
            loan.lender.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: 'Not authorized to delete this repayment' });
        }

        loan.totalRepaid -= repayment.amount;
        repayment.deleteOne();

        updateRepaymentSchedule(loan);

        loan.status = loan.totalRepaid >= loan.totalAmount ? 'completed' : 'active';

        await loan.save();


        res.status(200).json({ message: 'Repayment deleted successfully', loan });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting repayment', error: error.message });
    }
};

export const updateRepayment = async (req, res) => {
    try {
        const { loanId, paymentId } = req.params;
        const { amount, date } = req.body;

        if (!amount || !date) {
            return res.status(400).json({ message: 'Amount and date are required' });
        }

        const loan = await Loan.findById(loanId);
        if (!loan) return res.status(404).json({ message: 'Loan not found' });

        const repayment = loan.repayments.id(paymentId);
        if (!repayment) return res.status(404).json({ message: 'Repayment not found' });

        if (
            repayment.user.toString() !== req.user.id &&
            loan.lender.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: 'Not authorized to update this repayment' });
        }

        // Temporarily subtract old amount
        const originalAmount = repayment.amount;
        repayment.amount = amount;
        repayment.date = date;

        const newTotal = loan.repayments.reduce((sum, r) => sum + r.amount, 0);

        if (newTotal > loan.totalAmount) {
            return res.status(400).json({ message: `Updated repayment causes overpayment. Max allowed: ₹${loan.totalAmount - (loan.totalRepaid - originalAmount)}` });
        }

        loan.totalRepaid = newTotal;
        updateRepaymentSchedule(loan);
        loan.status = loan.totalRepaid >= loan.totalAmount ? 'completed' : 'active';

        await loan.save();

        res.status(200).json({ message: 'Repayment updated successfully', loan });

    } catch (error) {
        res.status(500).json({ message: 'Error updating repayment', error: error.message });
    }
};

export const getLoanRepayments = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.loanId)
            .populate('repayments.user', 'name email');

        if (!loan) return res.status(404).json({ message: 'Loan not found' });

        if (
            loan.borrower.toString() !== req.user.id &&
            loan.lender.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: 'Not authorized to view this loan' });
        }

        loan.repayments.sort((a, b) => new Date(a.date) - new Date(b.date));
        res.status(200).json(loan.repayments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching repayments', error: error.message });
    }
};

export const getLoanRepaymentsHistory = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.loanId)
            .populate('repayments.user', 'name email');

        if (!loan) return res.status(404).json({ message: 'Loan not found' });

        if (
            loan.borrower.toString() !== req.user.id &&
            loan.lender.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: 'Not authorized to view this history' });
        }

        const repayments = loan.repayments.map(r => ({
            amount: r.amount,
            date: r.date,
            user: r.user ? { name: r.user.name, email: r.user.email } : 'Unknown'
        }));

        repayments.sort((a, b) => new Date(a.date) - new Date(b.date));

        res.status(200).json(repayments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching repayment history', error: error.message });
    }
};
