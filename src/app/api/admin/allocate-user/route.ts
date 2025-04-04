import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendProgramAllocationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const { userId, action } = requestBody;

    if (!userId || !action) {
      console.error('Missing required fields:', { userId, action });
      return NextResponse.json({ error: 'User ID and action are required' }, { status: 400 });
    }

    // Get user details first to verify existence
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    });

    if (!user) {
      console.error('User not found:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Define the stage and status based on the action
    let newStage: string;
    let program: string;
    
    switch (action) {
      case 'incubation':
        program = 'Incubation';
        newStage = '4';
        break;
      case 'pre-incubation':
        program = 'Pre-Incubation';
        newStage = '4';
        break;
      case 'decline':
        newStage = 'Declined';
        program = '';
        break;
      default:
        console.error('Invalid action:', action);
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update the user's stage and status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        stage: newStage,
        programAllocated: program,
        requestStatus: action === 'decline' ? 'declined' : 'approved'
      }
    });

    try {
      if (action !== 'decline') {
        await sendProgramAllocationEmail({
          to: user.email,
          userName: user.name || 'User',
          programName: program,
          stage: newStage
        });
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Full error details:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { 
        error: 'Failed to allocate user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}