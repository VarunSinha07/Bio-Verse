import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    // Get the stage from request body
    const { stage } = await req.json();
    
    // Update the stage in the database
    await prisma.user.update({
      where: { email: userEmail },
      data: { stage }
    });

    // For now, we'll just return a success response
    return NextResponse.json({ 
      message: 'Stage progression request submitted successfully' 
    });

  } catch (error) {
    console.error('Error processing stage progression:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}