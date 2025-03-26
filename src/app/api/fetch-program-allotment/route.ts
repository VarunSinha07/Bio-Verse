import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Session } from "@/lib/session"

export async function POST(req: Request) {
  try {
    const session = await Session();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { startDate, resourceRequirements, acceptanceConfirmation } = body

    // Create or update program allotment
    const programAllotment = await prisma.programAllotment.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        startDate,
        resourceRequirements,
        acceptanceConfirmation,
      },
      create: {
        userId: session.user.id,
        startDate,
        resourceRequirements,
        acceptanceConfirmation,
      },
    })

    // Only update user stage and status if program is accepted
    if (acceptanceConfirmation) {
      const user = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
        select: {
          programAllocated: true
        }
      });

      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          stage: "programAllocated",
          status: `In ${user?.programAllocated}`,
        },
      })
    }

    return NextResponse.json(programAllotment)
  } catch (error) {
    console.error("[PROGRAM_ALLOTMENT_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}