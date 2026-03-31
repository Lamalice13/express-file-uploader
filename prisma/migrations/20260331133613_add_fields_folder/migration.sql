/*
  Warnings:

  - You are about to drop the column `name` on the `Folder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[original_name]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `original_name` to the `Folder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_id` to the `Folder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resource_type` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Folder_name_key";

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "uploadAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "name",
ADD COLUMN     "original_name" TEXT NOT NULL,
ADD COLUMN     "public_id" TEXT NOT NULL,
ADD COLUMN     "resource_type" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Folder_original_name_key" ON "Folder"("original_name");
