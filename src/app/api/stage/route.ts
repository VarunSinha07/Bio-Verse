import { Session } from "@/lib/session"
import  prisma  from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"


export async function POST(req: NextRequest) {
  try {
    const session = await Session();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { currentStage, newStatus } = body

    if (!currentStage || !newStatus) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Update the user's status in the database
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        status: newStatus,
        requestStatus: "",
      },
    })

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
      status: updatedUser.status,
    })
  } catch (error) {
    console.error("Error in stage update API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}