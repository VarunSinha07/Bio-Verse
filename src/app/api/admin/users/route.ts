import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    if (!status) {
      return NextResponse.json({ error: 'Status parameter is required' }, { status: 400 });
    }

    const users = await prisma.user.findMany({
      where: {
        status: status,
      },
      select: {
        id: true,
        name: true,
        email: true,
        questionnaires: {
          select: {
            ideaTitle: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    // Format the users to match the expected structure
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name || undefined, // Convert null to undefined
      email: user.email,
      questionnaire: user.questionnaires.length > 0 ? user.questionnaires[0] : null,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}