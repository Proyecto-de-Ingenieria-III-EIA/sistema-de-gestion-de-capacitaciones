-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "progress" "ProgressStatus" NOT NULL DEFAULT 'IN_PROGRESS';
