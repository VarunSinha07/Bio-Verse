import { z } from "zod";
import { createVerificationCode } from "@/lib/auth";
import { sendVerificationEmailWithCode } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const resendOtpSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate the input
    const result = resendOtpSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ message: "Invalid email address" }, { status: 400 });
    }
    
    const { email } = result.data;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    // Generate and send a new OTP
    const code = await createVerificationCode(email);
    await sendVerificationEmailWithCode(email, code);
    
    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in resend OTP route:", error);
    return NextResponse.json(
      { message: "Failed to resend OTP" },
      { status: 500 }
    );
  }
}