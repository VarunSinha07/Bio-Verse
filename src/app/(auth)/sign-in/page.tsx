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
import { signInFormSchema } from "@/lib/auth-schema"
import { authClient } from "@/lib/auth-client"
import { toast } from "@/hooks/use-toast"
import { Loader2, AlertCircle, Mail } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const SignIn = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)
  const [isResendingVerification, setIsResendingVerification] = useState(false)
  
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function resendVerificationEmail() {
    if (!unverifiedEmail) return
    
    setIsResendingVerification(true)
    try {
      await authClient.sendVerificationEmail({
        email: unverifiedEmail,
        callbackURL: "/form",
      })
      
      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox for the OTP verification code.",
        duration: 5000,
      })
      
      // Redirect to OTP verification page with email as query parameter
      router.push(`/verify-otp?email=${encodeURIComponent(unverifiedEmail)}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "We couldn't send a verification email. Please try again later."
      toast({
        title: "Failed to Resend Email",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsResendingVerification(false)
    }
  }

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    setIsLoading(true)
    setUnverifiedEmail(null)
    
    const { email, password } = values
    
    toast({
      title: "Signing In...",
      description: "Please wait while we verify your credentials.",
    })
    
    try {
      const { error } = await authClient.signIn.email(
        {
          email,
          password,
          callbackURL: "/form",
        },
        {
          onSuccess: () => {
            toast({
              title: "Success!",
              description: "You have been signed in successfully.",
              duration: 3000,
            })
            window.location.href = "/dashboard-page"
          },
          onError: async (ctx) => {
            if (ctx.error.status === 403) {
              setUnverifiedEmail(email)
              toast({
                title: "Email Not Verified",
                description: "Your account exists but email verification is required.",
                variant: "destructive",
                duration: 5000,
              })
            } else {
              toast({
                title: "Sign In Failed",
                description: ctx.error.message || "Invalid email or password.",
                variant: "destructive",
                duration: 5000,
              })
            }
          },
        },
      )
      
      if (error && error.status !== 403) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      toast({
        title: "System Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-xl transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-700">Sign In</CardTitle>
          <CardDescription className="text-green-600">Welcome Back! Please Sign In to continue</CardDescription>
        </CardHeader>
        <CardContent>
          {unverifiedEmail && (
            <Alert className="mb-6 bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-700">Email Not Verified</AlertTitle>
              <AlertDescription className="text-yellow-600">
                Your account exists but you need to verify your email before signing in.
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 border-yellow-300 text-yellow-700 hover:bg-yellow-100 flex items-center"
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
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
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
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