import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Session } from '@/lib/session';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Get user session to verify authentication
    const session = await Session();
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse form data with files
    const formData = await request.formData();
    
    // Define valid document types
    const validDocTypes = [
      'competitorAnalysis', 
      'foundersProfile', 
      'productMockups', 
      'marketResearch', 
      'signedNDA'
    ];
    
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
    await mkdir(uploadDir, { recursive: true });
    } catch (error) {
    console.error('Error creating uploads directory:', error);
    return NextResponse.json(
        { error: 'Failed to create upload directory' },
        { status: 500 }
    );
    }
    // Process each file in the form data
    const documentUpdates: Record<string, string> = {};
    
    for (const docType of validDocTypes) {
      const file = formData.get(docType) as File;
      
      if (file) {
        // Validate file type
        if (file.type !== 'application/pdf') {
          return NextResponse.json(
            { error: `Invalid file type for ${docType}. Only PDF is allowed.` }, 
            { status: 400 }
          );
        }
        
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: `${docType} file is too large. Maximum size is 5MB.` }, 
            { status: 400 }
          );
        }
        
        // Create a filename with user ID to avoid conflicts
        const fileName = `${session.user.id}-${docType}.pdf`;
        const filePath = path.join(uploadDir, fileName);
        
        // Save file to disk
        const fileArrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(fileArrayBuffer);
        await writeFile(filePath, buffer);
        
        // Add to updates object
        documentUpdates[docType] = fileName;
      }
    }
    
    // Check if document record already exists for this user
    const existingDocument = await prisma.document.findFirst({
      where: { userId: session.user.id }
    });
    
    let document;
    
    if (existingDocument) {
      // Update existing document record
      document = await prisma.document.update({
        where: { id: existingDocument.id },
        data: {
          ...documentUpdates,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new document record
      document = await prisma.document.create({
        data: {
          userId: session.user.id,
          ...documentUpdates
        }
      });
    }
    
    return NextResponse.json({ 
      success: true,
      document
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error in document upload API:', error);
    return NextResponse.json(
      { error: 'Failed to upload documents' }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};