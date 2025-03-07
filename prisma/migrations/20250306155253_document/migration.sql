-- CreateTable
CREATE TABLE "business_plan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemStatement" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "revenueModel" TEXT NOT NULL,
    "uniqueValueProposition" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "competitorAnalysis" TEXT,
    "foundersProfile" TEXT,
    "productMockups" TEXT,
    "marketResearch" TEXT,
    "signedNDA" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "business_plan_userId_idx" ON "business_plan"("userId");

-- CreateIndex
CREATE INDEX "document_userId_idx" ON "document"("userId");

-- AddForeignKey
ALTER TABLE "business_plan" ADD CONSTRAINT "business_plan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
