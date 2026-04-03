/*
  Warnings:

  - You are about to drop the column `mime_type` on the `File` table. All the data in the column will be lost.
  - Added the required column `file_type` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "mime_type",
ADD COLUMN     "file_type" TEXT NOT NULL,
ALTER COLUMN "uploadAt" SET DEFAULT NOW();
