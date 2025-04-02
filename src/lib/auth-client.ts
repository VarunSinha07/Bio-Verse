import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
});
await authClient.sendVerificationEmail({
  email: "user@email.com",
  callbackURL: "/sign-in", // The redirect URL after verification
});

export const { signIn, signUp, signOut, useSession } = authClient;

export const sendVerification = async (email: string, callbackURL: string) => {
  try {
    await authClient.sendVerificationEmail({
      email,
      callbackURL,
    });
    return { success: true };
  } catch (error) {
    console.error("Send verification error:", error);
    return { success: false, error };
  }

};