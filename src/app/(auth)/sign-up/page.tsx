"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signUpFormSchema } from "@/lib/auth-schema"
import { authClient } from "@/lib/auth-client"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const SignUp = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    setIsLoading(true)
    const { name, email, password } = values
    try {
      const { error } = await authClient.signUp.email(
        {
          email,
          password,
          name,
          callbackURL: "/verify-otp",
        },
        {
          onRequest: () => {
            toast({
              title: "Creating account...",
            })
          },
          onSuccess: () => {
            form.reset()
            toast({
              title: "OTP Sent",
              description: "Please check your email for the verification code."
            })
            // Redirect to OTP verification page with email
            router.push(`/verify-otp?email=${encodeURIComponent(email)}`)
          },
          onError: (ctx) => {
            toast({
              title: "Error",
              description: ctx.error.message,
              variant: "destructive",
            })
          },
        }
      )
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-xl transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-700">Sign Up</CardTitle>
          <CardDescription className="text-green-600">Welcome! Please Sign Up to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Name"
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
              <Button
                className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-green-600">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-green-700 hover:underline transition-all duration-300">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignUp