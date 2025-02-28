
import { NextResponse } from 'next/server';
import { QuestionnaireFormData } from '@/types/questionnaire';
import prisma from '@/lib/prisma';

interface ExtendedQuestionnaireData extends QuestionnaireFormData {
  userId: string;
  userEmail: string;
}

export async function POST(req: Request) {
  try {
    const data: ExtendedQuestionnaireData = await req.json();

    // Validate required fields
    const requiredFields: (keyof ExtendedQuestionnaireData)[] = [
      'userId',
      'userEmail',
      'name',
      'ideaTitle',
      'role',
      'ideaDescription',
      'industry',
      'stage',
    ];

    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Verify user exists and matches the provided email
    const user = await prisma.user.findFirst({
      where: {
        id: data.userId,
        email: data.userEmail,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid user credentials' },
        { status: 401 }
      );
    }

    // Create questionnaire and update user status in a transaction
    const result = await prisma.$transaction([
      // Save questionnaire
      prisma.questionnaire.create({
        data: {
          name: data.name,
          ideaTitle: data.ideaTitle,
          ideaDescription: data.ideaDescription,
          startUpName: data.startUpName,
          website: data.website,
          role: data.role,
          industry: data.industry,
          stage: data.stage,
          userId: data.userId,
        },
      }),
      // Update user's questionnaire status
      prisma.user.update({
        where: { id: data.userId },
        data: { hasCompletedQuestionnaire: true,
          stage: "1",
         },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Questionnaire submitted successfully',
      data: result[0],
    });
  } catch (error) {
    console.error('Questionnaire submission error:', error);

    return NextResponse.json(
      {
        error: 'Failed to submit questionnaire',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
