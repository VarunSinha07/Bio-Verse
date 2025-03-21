// app/api/mentor/schedule-meeting/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Session } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const sessionResult = await Session();
    if (!sessionResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { user } = sessionResult;

    const { userId, meetingDate, meetingTime, meetingLink } = await request.json();

    if (!userId || !meetingDate || !meetingTime || !meetingLink) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if there's an existing future meeting
    const existingMeeting = await prisma.meeting.findFirst({
      where: {
        userId: userId,
        date: {
          gte: new Date()
        }
      }
    });

    let meeting;
    
    if (existingMeeting) {
      // Update existing meeting
      meeting = await prisma.meeting.update({
        where: {
          id: existingMeeting.id
        },
        data: {
          date: new Date(meetingDate),
          time: meetingTime,
          link: meetingLink,
          mentorId: user.id,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new meeting
      meeting = await prisma.meeting.create({
        data: {
          userId: userId,
          date: new Date(meetingDate),
          time: meetingTime,
          link: meetingLink,
          mentorId: user.id
        }
      });
    }

    return NextResponse.json(meeting);
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    return NextResponse.json(
      { error: 'Failed to schedule meeting' },
      { status: 500 }
    );
  }
}