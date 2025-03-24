import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { Session } from '@/lib/session';

export async function GET(request: Request) {
  try {
    const sessionData = await Session();
    
    if (!sessionData || !sessionData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Fetch user from database to get role
    const userWithRole = await prisma.user.findUnique({
      where: { id: sessionData.user.id }
    });
    
    if (!userWithRole || userWithRole.userRole !== 'mentor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage');
    const filter = searchParams.get('filter') || 'all';

    if (!stage) {
      return NextResponse.json({ error: 'Stage parameter is required' }, { status: 400 });
    }
    // Define the where clause based on the stage
    const whereClause: Prisma.UserWhereInput = {};
    
    if (stage === 'In Incubation') {
      whereClause.status = 'In Incubation';
    } else {
      whereClause.stage = stage;
    }

    // Add filter for meeting status
    if (filter === 'scheduled') {
      whereClause.meetings = {
        some: {
          date: {
            gte: new Date()
          },
          isCompleted: false
        }
      };
    } else if (filter === 'pending') {
      whereClause.meetings = {
        none: {}
      };
    } else if (filter === 'completed') {
      whereClause.meetings = {
        some: {
          isCompleted: true
        }
      };
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        stage: true,
        questionnaires: {
          select: {
            ideaTitle: true,
            startUpName: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        meetings: {
          orderBy: {
            date: 'desc',
          },
          take: 1,
          select: {
            id: true,
            date: true,
            time: true,
            link: true,
            isCompleted: true,
            feedback: {
              select: {
                id: true,
                feedbackText: true,
                decision: true,
              }
            }
          }
        }
      },
    });

    // Format the users to match the expected structure
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name || undefined,
      email: user.email,
      stage: user.stage || undefined,
      questionnaire: user.questionnaires.length > 0 ? user.questionnaires[0] : null,
      nextMeeting: user.meetings.length > 0 ? {
        id: user.meetings[0].id,
        date: user.meetings[0].date.toISOString(),
        time: user.meetings[0].time,
        link: user.meetings[0].link,
        isCompleted: user.meetings[0].isCompleted,
        feedback: user.meetings[0].feedback
      } : null
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