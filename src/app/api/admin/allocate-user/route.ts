import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, action } = await request.json();

    if (!userId || !action) {
      return NextResponse.json({ error: 'User ID and action are required' }, { status: 400 });
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

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Error allocating user:', error);
    return NextResponse.json(
      { error: 'Failed to allocate user' },
      { status: 500 }
    );
  }
}