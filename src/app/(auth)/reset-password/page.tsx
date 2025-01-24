'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { authClient } from '@/lib/auth-client';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { resetPasswordFormSchema } from '@/lib/auth-schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { redirect } from 'next/navigation';

const Page = () => {
  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      newpassword: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordFormSchema>) {
    const { newpassword } = values;
    const { data, error } = await authClient.resetPassword(
      {
        newPassword: newpassword,
      },
      {
        onRequest: () => {
          toast({
            title: 'Please Wait...',
          });
        },
        onSuccess: () => {
          form.reset();
          toast({
            title: 'Success',
            description: 'Password reset successfully',
          });
          redirect('/sign-in');
        },
        onError: async (ctx) => {
          toast({
            title: 'Error',
            description: ctx.error.message,
          });
        },
      }
    );
    console.log(data);
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
      });
    }
  }
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Enter a new password</CardTitle>
        <CardDescription>
          Please enter a new password to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newpassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter a new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Page;
