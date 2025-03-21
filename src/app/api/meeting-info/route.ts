// src/app/api/meeting-info/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Session } from '@/lib/session';

const prisma = new PrismaClient();

interface MeetingResponse {
  id: string;
  mentorName: string;
  mentorEmail: string;
  date: string;
  time: string;
  link: string;
}

export async function GET() {
  try {
    // Get the authenticated user's session
    const sessionData = await Session();
    
    if (!sessionData || !sessionData.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = sessionData.user.id;
    console.log(`Fetching meetings for user: ${userId}`);
    
    // Fetch all meetings for the authenticated user
    const meetings = await prisma.meeting.findMany({
      where: {
        userId: userId
      }
    });
    
    console.log(`Found ${meetings.length} meetings for user`);
    
    if (meetings.length === 0) {
      // Return empty array if no meetings found - this is not an error
      return NextResponse.json([]);
    }
    
    // Fetch mentor information for each meeting
    const meetingsWithMentorInfo: MeetingResponse[] = await Promise.all(
      meetings.map(async (meeting) => {
        let mentorName = 'Not assigned';
        let mentorEmail = 'Not assigned';
        
        if (meeting.mentorId) {
          console.log(`Looking up mentor with ID: ${meeting.mentorId}`);
          
          // Find the mentor in the User table
          const mentor = await prisma.user.findUnique({
            where: {
              id: meeting.mentorId
            },
            select: {
              name: true,
              email: true,
              userRole: true
            }
          });
          
          if (mentor) {
            console.log(`Found mentor: ${mentor.name}, role: ${mentor.userRole}`);
            mentorName = mentor.name || 'Unknown';
            mentorEmail = mentor.email;
          } else {
            console.log(`Mentor with ID ${meeting.mentorId} not found in users table`);
          }
        }
        
        return {
          id: meeting.id,
          mentorName: mentorName,
          mentorEmail: mentorEmail,
          date: meeting.date.toISOString().split('T')[0],
          time: meeting.time,
          link: meeting.link || ''
        };
      })
    );
    
    return NextResponse.json(meetingsWithMentorInfo);
    
  } catch (error) {
    console.error('Error fetching meeting info:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}