import { Session } from '@/lib/session';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await Session();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch questionnaire data for the logged-in user
    const questionnaire = await prisma.questionnaire.findFirst({
      where: {
        userId: session.user.id
      }
    });

    return NextResponse.json({ questionnaire });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}