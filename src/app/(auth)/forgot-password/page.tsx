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
import { forgotPasswordFormSchema } from '@/lib/auth-schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const Page = () => {
  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordFormSchema>) {
    const { email } = values;
    const { data, error } = await authClient.forgetPassword(
      {
        email,
        redirectTo: '/reset-password',
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
            description: 'Password reset link sent to your email',
          });
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
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Please enter your email address to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="test@test.com" {...field} />
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
