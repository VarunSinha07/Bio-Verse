import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, action } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!action || !['approve', 'decline'].includes(action)) {
      return NextResponse.json({ error: 'Valid action (approve or decline) is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stage: true, status: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Map status to next stage
    const stageMapping: Record<string, string> = {
      'Applied for Stage 2': '2',
      'Applied for Stage 3': '3',
      'Applied for Incubation/Pre Incubation': 'preIncubation',
      'Incubation/Pre-incubation': 'incubation'
    };

    // Determine the next stage based on current status
    const currentStage = user.stage || '';
    const nextStage = action === 'approve' ? stageMapping[user.status || ''] || currentStage : currentStage;
    
    // Update user with new stage
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        stage: action === 'approve' ? nextStage : currentStage,
        requestStatus: action === 'approve' ? 'approved' : 'declined',
        updatedAt: new Date() // Update the updatedAt field
      },
    });

    return NextResponse.json({
      message: `User request ${action === 'approve' ? 'approved' : 'declined'} successfully`,
      user: updatedUser
    });
  } catch (error) {
    console.error(`Error processing user request:`, error);
    return NextResponse.json(
      { error: 'Failed to process user request' },
      { status: 500 }
    );
  }
}