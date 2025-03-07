
import { Session } from "@/lib/session"
import  prisma  from "@/lib/prisma"
import { NextResponse } from "next/server"


export async function GET() {
  try {
    const session = await Session();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        stage: true,
        status: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    return NextResponse.json({
      stage: Number(user.stage) || 1,
      status: user.status || ""
    })
  } catch (error) {
    console.error("Error in user-stage API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}