-- DropIndex
DROP INDEX "User_roleId_key";

-- AlterTable
ALTER TABLE "Training" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true;
