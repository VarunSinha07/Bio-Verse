import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Session } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const session = await Session();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const {
      problemStatement,
      targetAudience,
      revenueModel,
      uniqueValueProposition,
    } = await request.json();

    // Validate required fields
    if (
      !problemStatement ||
      !targetAudience ||
      !revenueModel ||
      !uniqueValueProposition
    ) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if business plan already exists for this user
    const existingPlan = await prisma.businessPlan.findFirst({
      where: { userId: session.user.id },
    });

    let businessPlan;

    if (existingPlan) {
      // Update existing business plan
      businessPlan = await prisma.businessPlan.update({
        where: { id: existingPlan.id },
        data: {
          problemStatement,
          targetAudience,
          revenueModel,
          uniqueValueProposition,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new business plan
      businessPlan = await prisma.businessPlan.create({
        data: {
          userId: session.user.id,
          problemStatement,
          targetAudience,
          revenueModel,
          uniqueValueProposition,
        },
      });
    }

    // Update user's stage if needed
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        stage: '2',
      },
    });

    return NextResponse.json(
      {
        success: true,
        businessPlan,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in business plan API:', error);
    return NextResponse.json(
      { error: 'Failed to save business plan' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
