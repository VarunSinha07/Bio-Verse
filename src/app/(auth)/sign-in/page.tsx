'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signInFormSchema } from '@/lib/auth-schema';
import { authClient } from '@/lib/auth-client';
import { toast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, Mail } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';

const SignIn = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function resendVerificationEmail() {
    if (!unverifiedEmail) return;

    setIsResendingVerification(true);
    try {
      await authClient.sendVerificationEmail({
        email: unverifiedEmail,
        callbackURL: '/form',
      });

      toast({
        title: 'Verification Email Sent',
        description: 'Please check your inbox for the OTP verification code.',
        duration: 5000,
      });

      // Redirect to OTP verification page with email as query parameter
      router.push(`/verify-otp?email=${encodeURIComponent(unverifiedEmail)}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "We couldn't send a verification email. Please try again later.";
      toast({
        title: 'Failed to Resend Email',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsResendingVerification(false);
    }
  }

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    setIsLoading(true);
    setUnverifiedEmail(null);

    const { email, password } = values;

    toast({
      title: 'Signing In...',
      description: 'Please wait while we verify your credentials.',
    });

    try {
      const { error } = await authClient.signIn.email(
        {
          email,
          password,
          callbackURL: '/form',
        },
        {
          onSuccess: () => {
            toast({
              title: 'Success!',
              description: 'You have been signed in successfully.',
              duration: 3000,
            });
            window.location.href = '/dashboard-page';
          },
          onError: async (ctx) => {
            if (ctx.error.status === 403) {
              setUnverifiedEmail(email);
              toast({
                title: 'Email Not Verified',
                description:
                  'Your account exists but email verification is required.',
                variant: 'destructive',
                duration: 5000,
              });
            } else {
              toast({
                title: 'Sign In Failed',
                description: ctx.error.message || 'Invalid email or password.',
                variant: 'destructive',
                duration: 5000,
              });
            }
          },
        }
      );

      if (error && error.status !== 403) {
        toast({
          title: 'Authentication Error',
          description: error.message,
          variant: 'destructive',
          duration: 5000,
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: 'System Error',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative w-full overflow-hidden bg-background px-4 py-2 md:py-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(20,184,166,0.18),_transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(13,148,136,0.14),_transparent_50%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.7),rgba(255,255,255,0.95))] dark:bg-[linear-gradient(to_bottom,rgba(2,6,23,0.78),rgba(2,6,23,0.95))]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl lg:grid-cols-2"
      >
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
          <div className="relative z-10">
            <p className="text-sm uppercase tracking-[0.24em] text-teal-100">
              BioVerse Access
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight">
              Welcome back to your innovation workspace.
            </h2>
            <p className="mt-4 max-w-sm text-teal-50/90">
              Continue building in biotech with secure collaboration, simulation
              insights, and program support.
            </p>
          </div>
          <div className="relative z-10 space-y-2 text-sm text-teal-50/90">
            <p>Trusted by founders, labs, and research teams.</p>
            <div className="h-1.5 w-28 rounded-full bg-white/70" />
          </div>
        </div>

        <Card className="w-full border-0 bg-transparent shadow-none">
          <CardHeader className="px-6 pb-2 pt-8 sm:px-10">
            <CardTitle className="text-3xl font-bold text-foreground">
              Sign In
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Access your BioVerse dashboard and continue your journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-4 sm:px-10">
            {unverifiedEmail && (
              <Alert className="mb-6 border-amber-300/70 bg-amber-50/80 dark:border-amber-800/60 dark:bg-amber-950/30">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-700">
                  Email Not Verified
                </AlertTitle>
                <AlertDescription className="text-yellow-600">
                  Your account exists but you need to verify your email before
                  signing in.
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 flex items-center border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/50"
                    onClick={resendVerificationEmail}
                    disabled={isResendingVerification}
                  >
                    {isResendingVerification ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="mr-2 h-4 w-4" />
                    )}
                    Resend Verification Email
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          {...field}
                          className="h-11 border-border/80 bg-background/80 focus:border-teal-500 focus-visible:ring-teal-500/30"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                          className="h-11 border-border/80 bg-background/80 focus:border-teal-500 focus-visible:ring-teal-500/30"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-sm text-muted-foreground">
                  Forgot Password?{' '}
                  <Link
                    href="/forgot-password"
                    className="font-medium text-teal-700 transition-colors hover:text-teal-600 hover:underline dark:text-teal-300 dark:hover:text-teal-200"
                  >
                    Reset Password
                  </Link>
                </p>
                <Button
                  className="h-11 w-full bg-teal-600 text-white transition-all duration-300 hover:bg-teal-700"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center px-6 pb-8 pt-2 sm:px-10">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                href="/sign-up"
                className="font-medium text-teal-700 transition-colors hover:text-teal-600 hover:underline dark:text-teal-300 dark:hover:text-teal-200"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignIn;
