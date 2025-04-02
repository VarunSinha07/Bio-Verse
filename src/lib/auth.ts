import { betterAuth } from 'better-auth';
import { sendEmail, sendVerificationEmail } from './email';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions = {
  adapter: prismaAdapter(prisma, {
    provider: 'postgresql'
  }),
  secret: process.env.AUTH_SECRET,
  providers: {
    email: {
      server: {
        host: "smtp.gmail.com",
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
    async signIn({ user }: { user: { id: string; email: string; emailVerified?: Date | null } }) {
      if (user) return true;
      return false;
    },
    async session({ session, user }: { session: { user: { id?: string } }, user: { id: string } }) {
      session.user.id = user.id;
      return session;
    },
  },
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await sendVerificationEmail(
          user.email,
          url.split('token=')[1].split('&')[0],
          url
        );
      } catch (error) {
        console.error("Email verification error:", error);
        throw error;
      }
    },
  },
  sendResetPassword: async ({ user, url }: { user: { email: string }, url: string }) => {
    await sendEmail(
      user.email,
      "Reset your password",
      `Click the link to reset your password: ${url}`
    );
  },
});