import { mailTransporter } from "../config/mail.js";

export const sendRegistrationEmail = async (email, name) => {
    const mailOptions = {
    from: `"BrokeBuddy" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to BrokeBuddy!',
    html: `<h3>Hello ${name},</h3><p>Welcome aboard! You've successfully registered on SmartLend.</p>`,
  };

  await mailTransporter.sendMail(mailOptions);
}