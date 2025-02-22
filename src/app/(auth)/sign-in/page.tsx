"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signInFormSchema } from "@/lib/auth-schema"
import { authClient } from "@/lib/auth-client"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    setIsLoading(true)
    const { email, password } = values
    const { data, error } = await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/form",
      },
      {
        onRequest: () => {
          toast({
            title: "Please Wait...",
          })
        },
        onSuccess: () => {
          window.location.href = "/dashboard-page"
        },
        onError: async (ctx) => {
          if (ctx.error.status === 403) {
            await authClient.sendVerificationEmail({
              email,
              callbackURL: "/dashboard",
            })
            toast({
              title: "Please verify your email",
              description: "Email verification has been sent, kindly verify",
            })
          }
          toast({
            title: "Error",
            description: ctx.error.message,
          })
        },
      },
    )
    console.log(data)
    if (error) {
      toast({
        title: "Error",
        description: error.message,
      })
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-xl transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-700">Sign In</CardTitle>
          <CardDescription className="text-green-600">Welcome Back! Please Sign In to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="test@test.com"
                        {...field}
                        className="border-green-200 focus:border-green-500 transition-all duration-300 hover:border-green-300"
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
                    <FormLabel className="text-green-700">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        className="border-green-200 focus:border-green-500 transition-all duration-300 hover:border-green-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-sm text-green-600">
                Forgot Password?{" "}
                <Link href="/forgot-password" className="text-green-700 hover:underline transition-all duration-300">
                  Reset Password
                </Link>
              </p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-green-600">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-green-700 hover:underline transition-all duration-300">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignIn

