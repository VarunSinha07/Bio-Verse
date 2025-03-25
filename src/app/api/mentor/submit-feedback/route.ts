import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Session } from '@/lib/session';

export async function POST(req: Request) {
    try {
        // Verify authenticated mentor
        const session = await Session();
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized. User not authenticated.' },
                { status: 403 }
            );
        }
        
        // Fetch user role from database
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });
        
        if (!user || user.userRole !== 'mentor') {
            return NextResponse.json(
                { error: 'Unauthorized. Only mentors can submit feedback.' },
                { status: 403 }
            );
        }
        
        // Parse request body
        const { meetingId, userId, feedbackText, decision } = await req.json();
        
        if (!meetingId || !userId || !feedbackText || !decision) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if meeting exists
        const meeting = await prisma.meeting.findUnique({
            where: { id: meetingId },
            include: { feedback: true },
        });
        
        if (!meeting) {
            return NextResponse.json(
                { error: 'Meeting not found' },
                { status: 404 }
            );
        }
        
        let feedback;
        if (meeting.feedback) {
            feedback = await prisma.feedback.update({
                where: { id: meeting.feedback.id },
                data: {
                    feedbackText,
                    decision,
                    updatedAt: new Date(),
                },
            });
        } else {
            feedback = await prisma.feedback.create({
                data: {
                    meetingId,
                    userId,
                    feedbackText,
                    decision,
                },
            });
        }
        
        // Only update status for Incubation and Pre-Incubation approvals
        if (decision === 'approve-incubation' || decision === 'approve-pre-incubation') {
            await prisma.user.update({
                where: {
                    id: feedback.userId,
                },
                data: {
                    status: `Applied for Stage 4`,
                    requestStatus: '',
                },
            });
        }
        
        // Mark meeting as completed
        await prisma.meeting.update({
            where: { id: meetingId },
            data: { isCompleted: true },
        });
       
        return NextResponse.json(
            { success: true, feedback },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}