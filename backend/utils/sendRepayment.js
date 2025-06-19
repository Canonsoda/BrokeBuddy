import { mailTransporter } from "../config/mail.js";

export const repaymentNotification = async (loan, amount, loanId, req) => {
    await mailTransporter.sendMail({
        from: `"BrokeBuddy" <${process.env.EMAIL_USER}>`,
        to: loan.lender.emailId,
        subject: 'Repayment Received',
        text: `₹${amount} has been repaid by ${req.user.name} towards Loan ID: ${loanId}`
    });
}