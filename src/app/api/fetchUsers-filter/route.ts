import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const filter = searchParams.get('filter') || 'all'; // 'all', 'approved', 'pending', 'declined'

    if (!status) {
      return NextResponse.json({ error: 'Status parameter is required' }, { status: 400 });
    }
    // Build where conditions
    const whereConditions: Prisma.UserWhereInput = {
      status: status
    };

    // Add filter conditions
    if (filter === 'approved') {
      whereConditions.status = 'approve';
    } else if (filter === 'pending') {
      whereConditions.status = null;
    } else if (filter === 'declined') {
      whereConditions.status = 'decline';
    }

    const users = await prisma.user.findMany({
      where: whereConditions,
      select: {
        id: true,
        name: true,
        email: true,
        stage: true,
        status: true,
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
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Format the users to match the expected structure
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name || undefined,
      email: user.email,
      stage: user.stage,
      requestStatus: user.status,
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