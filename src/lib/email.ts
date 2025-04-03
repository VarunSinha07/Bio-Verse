import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmailWithCode = async (to: string, code: string) => {
  try {
  
    
    const info = await transporter.sendMail({
      from: `"Bio-Verse" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your Email Verification OTP",
      html: `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #2563eb;">Welcome to Bio-Verse!</h2>
          <p>Please use the following OTP code to verify your email address:</p>
          <div style="
            background-color: #f3f4f6;
            padding: 20px;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            letter-spacing: 5px;
            margin: 20px 0;
            border-radius: 4px;
          ">
            ${code}
          </div>
          <p>Enter this OTP code on the verification page to complete your registration.</p>
          <p style="color: #666; font-size: 14px;">
            If you didn't create an account with Bio-Verse, please ignore this email.
          </p>
          <p style="color: #666; font-size: 14px;">
            This OTP code will expire in 15 minutes.
          </p>
        </div>
      `,
    });
    
    console.log("Verification email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};