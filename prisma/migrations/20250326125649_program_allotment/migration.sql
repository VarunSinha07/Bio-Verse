/*
  Warnings:

  - You are about to drop the column `programAllocated` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "programAllocated";

-- CreateTable
CREATE TABLE "program_allotment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programAllocated" TEXT,
    "acceptanceConfirmation" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TEXT NOT NULL,
    "resourceRequirements" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_allotment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "program_allotment_userId_key" ON "program_allotment"("userId");

-- AddForeignKey
ALTER TABLE "program_allotment" ADD CONSTRAINT "program_allotment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
