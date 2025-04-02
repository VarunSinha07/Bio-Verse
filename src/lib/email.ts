import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",  // Changed to use Gmail service directly
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Changed to use App Password
  },
});

// Add email verification function
export const sendVerificationEmail = async (to: string, token: string, callbackUrl: string) => {
  const verificationLink = `${process.env.BETTER_AUTH_URL}/verify?token=${token}&callback=${encodeURIComponent(callbackUrl)}`;
  
  try {
    const info = await transporter.sendMail({
      from: `"Bio-Verse" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Verify your email address",
      html: `
        <h2>Email Verification</h2>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>If you didn't request this verification, please ignore this email.</p>
      `,
    });
    console.log("Verification email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

// Function to send an email
export const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        const info = await transporter.sendMail({
            from: '"Varun Sinha" <varunsinha2604@gmail.com>', // Sender's email
            to, // Recipient's email
            subject, // Email subject
            text, // Plain text body
            html: `<p>${text}</p>` // HTML body (optional)
        });

        console.log("Email sent: ", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email: ", error);
        throw error;
    }
};


