/*
  Warnings:

  - Added the required column `mime_type` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "mime_type" TEXT NOT NULL,
ALTER COLUMN "uploadAt" SET DEFAULT NOW();
