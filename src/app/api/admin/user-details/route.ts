import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        stage: true,
        status: true,
        createdAt: true,
        questionnaires: {
          select: {
            role: true,
            ideaTitle: true,
            ideaDescription: true,
            startUpName: true,
            website: true,
            industry: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Format the user to match the expected structure
    const formattedUser = {
      id: user.id,
      name: user.name || undefined, // Convert null to undefined
      email: user.email,
      stage: user.stage || undefined,
      status: user.status || undefined,
      createdAt: user.createdAt.toISOString(),
      questionnaire: user.questionnaires.length > 0 ? user.questionnaires[0] : undefined,
    };

    return NextResponse.json(formattedUser);
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500 }
    );
  }
}