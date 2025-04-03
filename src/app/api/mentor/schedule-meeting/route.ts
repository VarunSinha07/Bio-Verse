import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Session } from '@/lib/session';
import { sendMeetingScheduledEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const sessionResult = await Session();
    if (!sessionResult) {
      console.error('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { user: mentor } = sessionResult;

    const requestBody = await request.json();
    const { userId, meetingDate, meetingTime, meetingLink } = requestBody;

    if (!userId || !meetingDate || !meetingTime || !meetingLink) {
      console.error('Missing required fields:', { userId, meetingDate, meetingTime, meetingLink });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    });

    if (!user) {
      console.error('User not found:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
      meeting = await prisma.meeting.update({
        where: {
          id: existingMeeting.id
        },
        data: {
          date: new Date(meetingDate),
          time: meetingTime,
          link: meetingLink,
          mentorId: mentor.id,
          updatedAt: new Date()
        }
      });
    } else {
      meeting = await prisma.meeting.create({
        data: {
          userId: userId,
          date: new Date(meetingDate),
          time: meetingTime,
          link: meetingLink,
          mentorId: mentor.id
        }
      });
    }

    try {
      await sendMeetingScheduledEmail({
        to: user.email,
        userName: user.name || 'User',
        mentorName: mentor.name || 'Mentor',
        mentorEmail: mentor.email,
        meetingDate: new Date(meetingDate),
        meetingTime,
        meetingLink
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json(meeting);
  } catch (error) {
    console.error('Full error details:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { 
        error: 'Failed to schedule meeting',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}