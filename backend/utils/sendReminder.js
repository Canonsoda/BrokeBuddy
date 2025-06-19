import {mailTransporter} from '../config/mail.js';

export const sendReminder = async (to,name,loanId,amountDue,dueDate) => {
    try {
        await mailTransporter.sendMail({
            from:`BrokeBuddy 👋 <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Loan Repayment Reminder',
            html: `
                <h1>Hi ${name},</h1>
                <p>This is a friendly reminder that your loan repayment is due soon.</p>
                <ul>
                    <li><strong>Loan ID:</strong> ${loanId}</li>
                    <li><strong>Amount Due:</strong> ₹${amountDue}</li>
                    <li><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</li>
                </ul>
                <p>Please ensure that you make the payment on or before the due date to avoid any penalties.</p>
                <p>Thank you for using <br>BrokeBuddy!</p>
            `
        })
    } catch (error) {
        console.error('Error sending reminder email:', error.message);
    }   
}
