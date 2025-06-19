import Loan from '../models/loan.model.js';
import User from '../models/user.model.js';
import { calculateTotalAmount } from '../utils/interest.js';
import mongoose from 'mongoose';
import { generateRepaymentSchedule } from "../utils/generateRepaymentSchedule.js";

const populateLoan = (query) => query.populate('borrower lender', 'name emailId');

export const createLoan = async (req, res) => {
  try {
    const {
      amount,
      interestRate,
      duration,
      borrowerEmail,
      purpose,
      interestType = "simple",
    } = req.body;

    if (!amount || !interestRate || !duration || !borrowerEmail) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const validTypes = ["simple", "compound"];
    if (!validTypes.includes(interestType)) {
      return res.status(400).json({ message: "Invalid interest type." });
    }

    const borrower = await User.findOne({ emailId: borrowerEmail });

    if (!borrower) {
      return res.status(404).json({ message: "Borrower not found." });
    }

    if (borrower._id.toString() === req.user.id) {
      return res.status(400).json({ message: "Lender and borrower cannot be the same person." });
    }

    const lender = await User.findById(req.user.id);
    if (!lender) {
      return res.status(404).json({ message: "Lender not found." });
    }

    // 🔢 Convert fields to numbers
    const principal = Number(amount);
    const rate = Number(interestRate);
    const time = Number(duration);

    // 🧮 Interest calculation using existing rounded function
    const totalAmount = calculateTotalAmount({ principal, rate, time, type: interestType });

    const dueDate = new Date(Date.now() + time * 30 * 24 * 60 * 60 * 1000);
    
    let repaymentSchedule;
    if (req.body.useEMI) {
      repaymentSchedule = generateRepaymentSchedule(totalAmount, duration);
    } else {
      repaymentSchedule = [
        {
          dueDate,
          amountDue: totalAmount,
          amountPaid: 0,
          status: "pending",
        },
      ];
    }
    const newLoan = new Loan({
      borrower: borrower._id,
      lender: lender._id,
      amount: principal,
      interestRate: rate,
      interestType,
      duration: time,
      purpose: purpose || "General",
      totalAmount,
      totalRepaid: 0,
      repaymentSchedule,
    });

    await newLoan.save();

    res.status(201).json({ message: "Loan created successfully", loan: newLoan });
  } catch (error) {
    console.error("Loan creation error:", error);
    res.status(500).json({ message: "Error creating loan", error: error.message });
  }
}


export const getLoans = async (req, res) => {
  try {
    const userRole = req.headers['x-active-role'];
    const userId = req.user.id;

    let filter = {};
    if (userRole === 'lender') {
      filter.lender = userId;
    } else if (userRole === 'borrower') {
      filter.borrower = userId;
    }

    const loans = await Loan.find(filter)
      .populate('borrower lender', 'name emailId')
      .populate('repayments.user', 'name emailId');

    if (!loans || loans.length === 0) {
      return res.status(200).json([]); // Return empty array if none
    }

    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loans', error: error.message });
  }
};


export const getLoanSummary = async (req, res) => {
  try {
    const userRole = req.headers['x-active-role'];
    const userId = req.user.id;

    const matchStage = {};
    if (userRole === 'lender') {
      matchStage.lender = new mongoose.Types.ObjectId(userId);
    } else if (userRole === 'borrower') {
      matchStage.borrower = new mongoose.Types.ObjectId(userId);
    }

    const summary = await Loan.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalInterest: {
            $sum: {
              $multiply: ['$amount', { $divide: ['$interestRate', 100] }]
            }
          },
          totalLoans: { $sum: 1 },
          completedLoans: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      }
    ]);

    if (summary.length === 0) {
      return res.status(200).json({
        totalAmount: 0,
        totalInterest: 0,
        totalLoans: 0,
        completedLoans: 0
      });
    }

    res.status(200).json(summary[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loan summary', error: error.message });
  }
};



export const getLoansByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const userRole = req.headers['x-active-role'];
    const userId = req.user.id;

    if (!status) {
      return res.status(400).json({ message: 'Status query parameter is required' });
    }

    const filter = { status };

    // Filter based on user role
    if (userRole === 'lender') {
      filter.lender = userId;
    } else if (userRole === 'borrower') {
      filter.borrower = userId;
    }

    const loans = await Loan.find(filter).populate('borrower lender', 'name emailId');

    if (!loans || loans.length === 0) {
      return res.status(404).json({ message: 'No loans found with the specified status' });
    }

    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loans by status', error: error.message });
  }
};


export const getLoansByUserIdAndStatus = async (req, res) => {
    try {
        const { userId, status } = req.params;
        const loans = await Loan.find({
            $or: [{ borrower: userId }, { lender: userId }],
            status: status
        }).populate('borrower lender', 'name emailId');
        if (!loans || loans.length === 0) {
            return res.status(404).json({ message: 'No loans found for this user with the specified status' });
        }
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching loans for user with status', error: error.message });
    }
}

export const getLoansByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const loans = await Loan.find({
            $or: [{ borrower: userId }, { lender: userId }]
        }).populate('borrower lender', 'name emailId');
        if (!loans || loans.length === 0) {
            return res.status(404).json({ message: 'No loans found for this user' });
        }
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching loans for user', error: error.message });
    }
}

export const getLoanByBorrower = async (req, res) => {
    try {
        const borrowerId = req.params.borrowerId;
        const loans = await Loan.find({ borrower: borrowerId }).populate('borrower lender', 'name emailId');
        if (!loans || loans.length === 0) {
            return res.status(404).json({ message: 'No loans found for this borrower' });
        }
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching loans for borrower', error: error.message });
    }
}

export const getLoanByLender = async (req, res) => {
    try {
        const lenderId = req.params.lenderId;
        const loans = await Loan.find   ({ lender: lenderId }).populate('borrower lender', 'name emailId');
        if (!loans || loans.length === 0) {
            return res.status(404).json({ message: 'No loans found for this lender' });
        }   
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching loans for lender', error: error.message });
    }
}

export const getLoanById = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id).populate('borrower lender', 'name emailId');
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        res.status(200).json(loan);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching loan', error: error.message });
    }
}
// Update loan details
// This function allows updating the loan details such as amount, interest rate, duration, and purpose.
export const updateLoan = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        if (loan.lender.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied: not the owner of the loan' });
        }
        
        if(loan.totalAmount<=loan.totalRepaid){
            return res.status(400).json({ message: 'Cannot update loan that is already fully repaid' });
        }

        const updatedLoan = await Loan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('borrower lender', 'name emailId');

        res.status(200).json({ message: 'Loan updated successfully', loan: updatedLoan });
    } catch (error) {
        res.status(500).json({ message: 'Error updating loan', error: error.message });
    }
};


export const deleteLoan = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        if (loan.lender.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied: not the owner of the loan' });
        }

        if(loan.totalRepaid > 0){
            return res.status(400).json({ message: 'Cannot delete loan with repayments' });
        }

        await Loan.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Loan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting loan', error: error.message });
    }
};

// Update loan status
// This function allows updating the status of a loan (e.g., approved, rejected, pending).
export const updateLoanStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const loan = await Loan.findById(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        if (loan.lender.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied: not the owner of the loan' });
        }

        loan.status = status;
        await loan.save();
        const populatedLoan = await loan.populate('borrower lender', 'name emailId');

        res.status(200).json({ message: 'Loan status updated successfully', loan: populatedLoan });
    } catch (error) {
        res.status(500).json({ message: 'Error updating loan status', error: error.message });
    }
};
export const updateRepaymentScheduleManually = async (req, res) => {
  try {
    const { id } = req.params;
    const { updatedSchedule } = req.body;

    if (!Array.isArray(updatedSchedule) || updatedSchedule.length === 0) {
      return res.status(400).json({ message: 'Invalid repayment schedule' });
    }

    const loan = await Loan.findById(id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    if (loan.lender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the lender can edit the repayment schedule' });
    }

    // Validate structure
    for (const payment of updatedSchedule) {
      if (
        !payment.dueDate ||
        typeof payment.amountDue !== 'number' ||
        payment.amountDue <= 0
      ) {
        return res.status(400).json({ message: 'Each repayment must have a valid dueDate and amountDue' });
      }
    }

    // Reset repayment schedule
    loan.repaymentSchedule = updatedSchedule.map((item) => ({
      dueDate: new Date(item.dueDate),
      amountDue: item.amountDue,
      amountPaid: 0,
      status: "pending",
    }));

    // Reset repaid amount and status
    loan.totalRepaid = 0;
    loan.status = "pending";

    await loan.save();

    res.status(200).json({ message: 'Repayment schedule updated', loan });
  } catch (error) {
    console.error("Schedule update error:", error);
    res.status(500).json({ message: 'Error updating repayment schedule', error: error.message });
  }
};
