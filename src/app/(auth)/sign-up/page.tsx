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
import { signUpFormSchema } from '@/lib/auth-schema';
import { authClient } from '@/lib/auth-client';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SignUp = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    setIsLoading(true);
    const { name, email, password } = values;
    try {
      toast({
        title: 'Creating account...',
        description: 'Please wait while we set up your account.',
      });

      // Initialize user but don't complete signup until verification
      const { error } = await authClient.signUp.email(
        {
          email,
          password,
          name,
          callbackURL: '/verify-otp',
        },
        {
          onSuccess: () => {
            form.reset();
            toast({
              title: 'Verification Required',
              description:
                'A verification code has been sent to your email. Please verify to complete your registration.',
              duration: 5000,
            });
            // Redirect to OTP verification page with email
            router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
          },
          onError: (ctx) => {
            toast({
              title: 'Sign Up Failed',
              description:
                ctx.error.message ||
                'There was a problem creating your account.',
              variant: 'destructive',
              duration: 5000,
            });
          },
        }
      );

      if (error) {
        toast({
          title: 'Error',
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
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.16),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.13),_transparent_50%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.72),rgba(255,255,255,0.95))] dark:bg-[linear-gradient(to_bottom,rgba(2,6,23,0.78),rgba(2,6,23,0.95))]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl lg:grid-cols-2"
      >
        <Card className="order-2 w-full border-0 bg-transparent shadow-none lg:order-1">
          <CardHeader className="px-6 pb-2 pt-8 sm:px-10">
            <CardTitle className="text-3xl font-bold text-foreground">
              Sign Up
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Create your BioVerse account and start building with confidence.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-4 sm:px-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Name"
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
                          placeholder="Create a strong password"
                          {...field}
                          className="h-11 border-border/80 bg-background/80 focus:border-teal-500 focus-visible:ring-teal-500/30"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="h-11 w-full bg-teal-600 text-white transition-all duration-300 hover:bg-teal-700"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center px-6 pb-8 pt-2 sm:px-10">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/sign-in"
                className="font-medium text-teal-700 transition-colors hover:text-teal-600 hover:underline dark:text-teal-300 dark:hover:text-teal-200"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="order-1 relative hidden overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-10 text-white lg:order-2 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
          <div className="relative z-10">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-100">
              Build With BioVerse
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight">
              Start your biotech journey with an ecosystem built to scale.
            </h2>
            <p className="mt-4 max-w-sm text-emerald-50/90">
              Join programs, access simulation-first workflows, and collaborate
              with mentors and peers from day one.
            </p>
          </div>
          <div className="relative z-10 space-y-2 text-sm text-emerald-50/90">
            <p>Fast onboarding. Secure access. Purposeful growth.</p>
            <div className="h-1.5 w-28 rounded-full bg-white/70" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
