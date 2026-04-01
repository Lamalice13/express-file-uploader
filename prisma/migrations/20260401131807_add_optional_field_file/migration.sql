-- DropIndex
DROP INDEX "File_original_name_key";

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "uploadAt" SET DEFAULT NOW();
