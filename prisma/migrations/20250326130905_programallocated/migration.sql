/*
  Warnings:

  - You are about to drop the column `programAllocated` on the `program_allotment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "program_allotment" DROP COLUMN "programAllocated";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "programAllocated" TEXT;
