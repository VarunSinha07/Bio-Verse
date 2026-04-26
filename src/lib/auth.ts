import { betterAuth } from 'better-auth';
import { sendVerificationEmailWithCode, sendPasswordResetOTP } from './email';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { randomUUID } from 'crypto';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const authOptions = {
  adapter: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: process.env.AUTH_SECRET,
  providers: {
    email: {
      server: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      from: process.env.EMAIL_USER,
    },
  },
  callbacks: {
    async signIn({
      user,
    }: {
      user: { id: string; email: string; emailVerified?: Date | null };
    }) {
      // Only allow sign in if email is verified
      if (user && user.emailVerified) return true;
      return false;
    },
    async session({
      session,
      user,
    }: {
      session: { user: { id?: string } };
      user: { id: string };
    }) {
      session.user.id = user.id;
      return session;
    },
  },
};

// Function to create a verification token and store it properly
export async function createVerificationCode(email: string) {
  try {
    // Generate a 6-digit verification code (always 6 digits)
    const verificationCode = String(
      100000 + Math.floor(Math.random() * 900000)
    );

    // Set expiration to 15 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Delete any existing verification for this email
    await prisma.verification.deleteMany({
      where: {
        identifier: email,
      },
    });

    // Create new verification record
    await prisma.verification.create({
      data: {
        id: randomUUID(),
        identifier: email,
        value: verificationCode,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Send the OTP email
    await sendPasswordResetOTP(email, verificationCode);

    return verificationCode;
  } catch (error) {
    console.error('Error creating verification code:', error);
    throw error;
  }
}

// Verify OTP function
export async function verifyOTP(email: string, code: string) {
  try {
    // Find the verification record
    const verification = await prisma.verification.findFirst({
      where: {
        identifier: email,
        value: code,
        expiresAt: {
          gt: new Date(), // Not expired
        },
      },
    });

    if (!verification) {
      return {
        success: false,
        message: 'Invalid or expired verification code',
      };
    }

    // Mark user as verified
    await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });

    // Delete the verification record
    await prisma.verification.delete({
      where: { id: verification.id },
    });

    return { success: true };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, message: 'Error verifying OTP' };
  }
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    generateVerificationToken: async ({ email }: { email: string }) => {
      if (!email) {
        console.error('No email provided for verification code generation');
        throw new Error('Email is required for verification code generation');
      }

      console.log(`Generating verification code for email: ${email}`);
      // Create and store the verification code, then return it
      const code = await createVerificationCode(email);
      return code;
    },

    sendVerificationEmail: async ({ user }) => {
      try {
        if (!user || !user.email) {
          console.error('Invalid user object for verification email:', user);
          throw new Error('Valid user with email is required');
        }

        // Generate a new verification code
        const code = await createVerificationCode(user.email);

        if (!code) {
          throw new Error('Failed to generate verification code');
        }

        // Send verification email with OTP code
        await sendVerificationEmailWithCode(user.email, code);

        console.log('Verification email sent to:', user.email);
      } catch (error) {
        console.error('Email verification error:', error);
        throw error;
      }
    },
  },
});
