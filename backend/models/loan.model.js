import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    interestRate: {
        type: Number,
        default: 0, // in percentage
        required: true
    },
    interestType:{
        type: String,
        enum: ['simple', 'compound'],
        default: 'simple'
    },
    duration: {
        type: Number, // in months
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    repaymentSchedule: [{
        dueDate: {
            type: Date,
            required: true
        },
        amountDue: {
            type: Number,
            required: true
        },
        amountPaid: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ['pending','partial','paid', 'overdue'],
            default: 'pending'
        }   
    }],
    repayments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    totalAmount: {
    type: Number,
    default: 0,
    },
    totalRepaid: {
    type: Number,
    default: 0,
    },
    purpose: {
        type: String,
        required: true
    },
}, { timestamps: true });

export default mongoose.model('Loan', loanSchema);