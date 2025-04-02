import { verifyOTP } from "@/lib/auth";
import { verifyOtpSchema } from "@/lib/auth-schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate the input
    const result = verifyOtpSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }
    
    const { email, otp } = result.data;
    
    // Verify the OTP
    const verification = await verifyOTP(email, otp);
    
    if (!verification.success) {
      return NextResponse.json({ message: verification.message }, { status: 400 });
    }
    
    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in verify OTP route:", error);
    return NextResponse.json(
      { message: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}