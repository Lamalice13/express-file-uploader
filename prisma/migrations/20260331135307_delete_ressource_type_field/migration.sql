/*
  Warnings:

  - You are about to drop the column `resource_type` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "resource_type",
ALTER COLUMN "uploadAt" SET DEFAULT NOW();
