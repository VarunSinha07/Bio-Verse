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
export const sendApprovalEmail = async (to: string, stage: string, ndaPath?: string) => {
  try {
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"Bio-Verse" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Application Approved for Stage ${stage}`,
      html: `
        <div style="
          max-width: 600px;
          margin: 0 auto;
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #333;
          line-height: 1.6;
        ">
          <div style="
            background: linear-gradient(135deg, #2563eb, #1e40af);
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          ">
            <h1 style="
              color: white;
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            ">
              Congratulations!
            </h1>
          </div>
          
          <div style="
            padding: 30px;
            background: white;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          ">
            <p style="font-size: 16px; margin-bottom: 20px;">
              We're pleased to inform you that your application for Stage
              <strong style="color: #2563eb;">${stage}</strong> 
              has been approved by the Bio-Verse team.
            </p>
            
            ${ndaPath ? `
            <div style="
              background: #f8fafc;
              border-left: 4px solid #2563eb;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            ">
              <h3 style="
                margin-top: 0;
                color: #1e293b;
                font-size: 18px;
              ">
                Signed NDA Document
              </h3>
              <p style="margin-bottom: 0;">
                Attached is your signed Non-Disclosure Agreement (NDA) document for reference.
                <span style="
                  display: block;
                  margin-top: 10px;
                  color: #64748b;
                  font-size: 14px;
                ">
                  Important: This document contains legally binding confidential information. 
                  Please ensure proper handling and storage.
                </span>
              </p>
            </div>
            ` : ''}
            
            <div style="
              background: #f0fdf4;
              border-left: 4px solid #16a34a;
              padding: 15px;
              margin: 25px 0;
              border-radius: 4px;
            ">
              <h3 style="
                margin-top: 0;
                color: #166534;
                font-size: 18px;
              ">
                Next Steps
              </h3>
              <p style="margin-bottom: 0;">
                You can now proceed to the next phase of your Bio-Verse journey.
                Our team will be in touch shortly with further instructions.
              </p>
            </div>
            
            <div style="
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: 14px;
            ">
              <p style="margin: 5px 0;">
                If you have any questions, please don't hesitate to contact our support team.
              </p>
              <p style="margin: 5px 0;">
                Best regards,<br>
                The Bio-Verse Team
              </p>
            </div>
          </div>
        </div>
      `,
    };

    if (ndaPath) {
      mailOptions.attachments = [{
        filename: 'signedNDA.pdf',
        path: ndaPath
      }];
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("Approval email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending approval email:", error);
    throw error;
  }
};

export const sendMeetingScheduledEmail = async ({
  to,
  userName,
  mentorName,
  mentorEmail,
  meetingDate,
  meetingTime,
  meetingLink
}: {
  to: string;
  userName: string;
  mentorName: string;
  mentorEmail: string;
  meetingDate: Date;
  meetingTime: string;
  meetingLink: string;
}) => {
  try {
    // Convert time to 12-hour format
    const [hours, minutes] = meetingTime.split(':');
    const time12hr = new Date(0, 0, 0, parseInt(hours), parseInt(minutes)).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"Bio-Verse" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Mentoring Session Scheduled with ${mentorName}`,
      html: `
        <div style="
          max-width: 600px;
          margin: 0 auto;
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #333;
          line-height: 1.6;
        ">
          <div style="
            background: linear-gradient(135deg, #2563eb, #1e40af);
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          ">
            <h1 style="
              color: white;
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            ">
              Mentoring Session Scheduled
            </h1>
          </div>
          
          <div style="
            padding: 30px;
            background: white;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          ">
            <p style="font-size: 16px; margin-bottom: 20px;">
              Hello ${userName},
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Your mentoring session with <strong>${mentorName}</strong> has been scheduled.
            </p>
            
            <div style="
              background: #f8fafc;
              border-left: 4px solid #2563eb;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            ">
              <h3 style="
                margin-top: 0;
                color: #1e293b;
                font-size: 18px;
              ">
                Meeting Details
              </h3>
              <div style="margin-bottom: 10px;">
                <strong>Date:</strong> ${meetingDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div style="margin-bottom: 10px;">
                <strong>Time:</strong> ${time12hr}
              </div>
              <div style="margin-bottom: 10px;">
                <strong>Mentor:</strong> ${mentorName} (${mentorEmail})
              </div>
              <div style="margin-bottom: 0;">
                <strong>Meeting Link:</strong> 
                <a href="${meetingLink}" target="_blank" style="color: #2563eb; text-decoration: none;">
                  ${meetingLink}
                </a>
              </div>
            </div>
            
            <div style="
              background: #f0fdf4;
              border-left: 4px solid #16a34a;
              padding: 15px;
              margin: 25px 0;
              border-radius: 4px;
            ">
              <h3 style="
                margin-top: 0;
                color: #166534;
                font-size: 18px;
              ">
                Preparation Tips
              </h3>
              <p style="margin-bottom: 0;">
                • Review your business plan and documents before the meeting<br>
                • Prepare any questions you have for your mentor<br>
                • Join the meeting 5 minutes early to test your connection
              </p>
            </div>
            
            <div style="
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: 14px;
            ">
              <p style="margin: 5px 0;">
                If you need to reschedule, please contact your mentor directly.
              </p>
              <p style="margin: 5px 0;">
                Best regards,<br>
                The Bio-Verse Team
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Meeting scheduled email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending meeting scheduled email:", error);
    throw error;
  }
};