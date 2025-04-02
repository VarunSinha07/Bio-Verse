import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Session } from "@/lib/session"

export async function GET() {
  try {
    const session = await Session();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userData = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        programAllocated: true,
        programAllotment: true,
      },
    })

    if (!userData) {
      return new NextResponse("User not found", { status: 404 })
    }

    return NextResponse.json({
      programAllocated: userData.programAllocated,
      programAllotment: userData.programAllotment,
    })
  } catch (error) {
    console.error("[PROGRAM_ALLOCATION_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}