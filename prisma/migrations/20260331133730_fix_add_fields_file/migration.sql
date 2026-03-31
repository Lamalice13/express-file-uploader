/*
  Warnings:

  - You are about to drop the column `name` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `original_name` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `public_id` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `resource_type` on the `Folder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[original_name]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `original_name` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_id` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resource_type` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "File_name_key";

-- DropIndex
DROP INDEX "Folder_original_name_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "name",
ADD COLUMN     "original_name" TEXT NOT NULL,
ADD COLUMN     "public_id" TEXT NOT NULL,
ADD COLUMN     "resource_type" TEXT NOT NULL,
ALTER COLUMN "uploadAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "original_name",
DROP COLUMN "public_id",
DROP COLUMN "resource_type";

-- CreateIndex
CREATE UNIQUE INDEX "File_original_name_key" ON "File"("original_name");
