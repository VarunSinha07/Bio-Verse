"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { verifyOtpSchema } from "@/lib/auth-schema"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const VerifyOTP = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams?.get("email") || ""
  
  const [isLoading, setIsLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  
  const form = useForm<z.infer<typeof verifyOtpSchema>>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: email,
      otp: "",
    },
  })

  // Update email field when URL param changes
  useEffect(() => {
    form.setValue("email", email)
  }, [email, form])

  // Countdown timer for resend button
  useEffect(() => {
    if (timeLeft <= 0) return
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [timeLeft])

  async function onSubmit(values: z.infer<typeof verifyOtpSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to verify OTP")
      }
      
      toast({
        title: "Success",
        description: "Email verified successfully! You can now sign in.",
      })
      
      // Redirect to sign-in page
      router.push("/sign-in")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify OTP",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResendOTP() {
    if (!email) {
      toast({
        title: "Error",
        description: "Email address is required",
        variant: "destructive",
      })
      return
    }
    
    setResendLoading(true)
    try {
      const response = await fetch("/api/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP")
      }
      
      toast({
        title: "OTP Sent",
        description: "A new verification code has been sent to your email.",
      })
      
      // Set cooldown for resend button - 60 seconds
      setTimeLeft(60)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend OTP",
        variant: "destructive",
      })
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-xl transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-700">Verify Email</CardTitle>
          <CardDescription className="text-green-600">
            Enter the 6-digit code sent to your email
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
                    <FormLabel className="text-green-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="test@test.com"
                        {...field}
                        readOnly
                        className="border-green-200 bg-green-50 focus:border-green-500 transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700">Verification Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123456"
                        {...field}
                        maxLength={6}
                        className="border-green-200 focus:border-green-500 transition-all duration-300 hover:border-green-300 text-center tracking-widest text-lg"
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
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify Email"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-green-600 mb-2">Didn&apos;t receive the code?</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendOTP}
              disabled={resendLoading || timeLeft > 0}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              {resendLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : timeLeft > 0 ? (
                `Resend in ${timeLeft}s`
              ) : (
                "Resend Code"
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-green-600">
            Back to{" "}
            <Link href="/sign-in" className="text-green-700 hover:underline transition-all duration-300">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default VerifyOTP