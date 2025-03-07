import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { mkdir } from 'fs/promises';
import { join } from 'path';
// Removed UUID import as it's no longer needed

export async function POST(request: Request) {
  try {
    // Check if the request is multipart form data or JSON
    const contentType = request.headers.get('content-type') || '';
    
    let userId: string;
    let action: 'approve' | 'decline';
    let ndaFile: File | null = null;
    
    if (contentType.includes('multipart/form-data')) {
      // Handle multipart form data (with file upload)
      const formData = await request.formData();
      userId = formData.get('userId') as string;
      action = formData.get('action') as 'approve' | 'decline';
      ndaFile = formData.get('ndaFile') as File;
    } else {
      // Handle JSON data
      const body = await request.json();
      userId = body.userId;
      action = body.action;
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!action || !['approve', 'decline'].includes(action)) {
      return NextResponse.json({ error: 'Valid action (approve or decline) is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stage: true, status: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Map status to next stage
    const stageMapping: Record<string, string> = {
      'Applied for Stage 2': '2',
      'Applied for Stage 3': '3',
      'Applied for Incubation/Pre Incubation': 'preIncubation',
      'Incubation/Pre-incubation': 'incubation'
    };

    // Check if we need an NDA (for Stage 3 approvals)
    const isStage3Application = user.status === 'Applied for Stage 3';
    let ndaDocumentUrl: string | null = null;
    
    // Only process NDA file for Stage 3 applications
    if (action === 'approve' && isStage3Application) {
      if (!ndaFile) {
        return NextResponse.json({ 
          error: 'NDA document is required for Stage 3 approval' 
        }, { status: 400 });
      }
      
      try {
        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadsDir, { recursive: true });
        
        // Fixed file name format: userId-signedNDA.pdf
        const fileName = `${userId}-signedNDA.pdf`;
        const filePath = join(uploadsDir, fileName);
        
        // Save file (will overwrite existing file with same name)
        const fileBuffer = Buffer.from(await ndaFile.arrayBuffer());
        await writeFile(filePath, fileBuffer);
        
        // Save the relative URL
        ndaDocumentUrl = `/uploads/${fileName}`;
        
        // Record the document in database
        const existingDoc = await prisma.document.findFirst({
          where: {
            userId: userId
          }
        });
        
        if (existingDoc) {
          // Update existing document
          await prisma.document.update({
            where: { id: existingDoc.id },
            data: { signedNDA: ndaDocumentUrl }
          });
        } else {
          // Create new document
          await prisma.document.create({
            data: {
              userId: userId,
              signedNDA: ndaDocumentUrl
            }
          });
        }
      } catch (fileError) {
        console.error('Error saving NDA file:', fileError);
        return NextResponse.json({ 
          error: 'Failed to save NDA document' 
        }, { status: 500 });
      }
    }

    // Determine the next stage based on current status
    const currentStage = user.stage || '';
    let nextStage = currentStage;
    
    if (action === 'approve' && user.status && stageMapping[user.status]) {
      nextStage = stageMapping[user.status];
    }
    
    // Update user with new stage
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        stage: action === 'approve' ? nextStage : currentStage,
        requestStatus: action === 'approve' ? 'approved' : 'declined',
        updatedAt: new Date(),
        // Add NDA document reference only if it was processed
        ...(ndaDocumentUrl && { ndaDocumentUrl })
      },
    });

    return NextResponse.json({
      message: `User request ${action === 'approve' ? 'approved' : 'declined'} successfully`,
      user: updatedUser,
      ...(ndaDocumentUrl && { ndaDocumentUrl })
    });
  } catch (error) {
    console.error(`Error processing user request:`, error);
    return NextResponse.json(
      { error: 'Failed to process user request', details: (error as Error).message },
      { status: 500 }
    );
  }
}
