import { createAuthClient } from 'better-auth/react';
export const authClient = createAuthClient({
  baseURL: process.env.BETTERAUTH_URL,
});

export const { signIn, signUp, useSession } = createAuthClient();
