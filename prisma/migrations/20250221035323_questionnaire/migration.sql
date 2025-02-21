-- AlterTable
ALTER TABLE "questionnaire" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "startUpName" TEXT,
ADD COLUMN     "website" TEXT;
