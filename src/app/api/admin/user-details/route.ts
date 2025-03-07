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
        requestStatus: true,
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
        businessPlans: {
          select: {
            problemStatement: true,
            targetAudience: true,
            revenueModel: true,
            uniqueValueProposition: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        documents: {
          select: {
            id: true,
            competitorAnalysis: true,
            foundersProfile: true,
            productMockups: true,
            marketResearch: true,
            signedNDA: true,
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
      name: user.name || undefined,
      email: user.email,
      stage: user.stage || undefined,
      status: user.status || undefined,
      requestStatus: user.requestStatus || undefined,
      createdAt: user.createdAt.toISOString(),
      questionnaire: user.questionnaires.length > 0 ? user.questionnaires[0] : undefined,
      // Format business plan data
      businessPlan: user.businessPlans.length > 0 ? {
        executiveSummary: user.businessPlans[0].problemStatement,
        marketAnalysis: user.businessPlans[0].targetAudience,
        financialProjections: user.businessPlans[0].revenueModel,
        timeline: user.businessPlans[0].uniqueValueProposition,
      } : undefined,
      // Format documents data
      documents: user.documents.length > 0 ? [
        user.documents[0].competitorAnalysis && {
          id: `${user.id}-competitorAnalysis`,
          name: 'Competitor Analysis',
          url: `/documents/${user.documents[0].competitorAnalysis}`,
          type: 'pdf'
        },
        user.documents[0].foundersProfile && {
          id: `${user.id}-foundersProfile`,
          name: 'Founders Profile',
          url: `/documents/${user.documents[0].foundersProfile}`,
          type: 'pdf'
        },
        user.documents[0].productMockups && {
          id: `${user.id}-productMockups`,
          name: 'Product Mockups',
          url: `/documents/${user.documents[0].productMockups}`,
          type: 'pdf'
        },
        user.documents[0].marketResearch && {
          id: `${user.id}-marketResearch`,
          name: 'Market Research',
          url: `/documents/${user.documents[0].marketResearch}`,
          type: 'pdf'
        },
        user.documents[0].signedNDA && {
          id: `${user.id}-signedNDA`,
          name: 'Signed NDA',
          url: `/documents/${user.documents[0].signedNDA}`,
          type: 'pdf'
        }
      ].filter(Boolean) : [],
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