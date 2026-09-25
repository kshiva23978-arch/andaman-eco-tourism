/*
  Warnings:

  - You are about to drop the column `destinationId` on the `MapPin` table. All the data in the column will be lost.
  - You are about to drop the column `scope` on the `Section` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MapPin" DROP CONSTRAINT "MapPin_destinationId_fkey";

-- DropIndex
DROP INDEX "MapPin_destinationId_key";

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "guideCallout" TEXT;

-- AlterTable
ALTER TABLE "MapPin" DROP COLUMN "destinationId",
ADD COLUMN     "destinationSlug" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "scope",
ADD COLUMN     "pages" TEXT[];

-- DropEnum
DROP TYPE "SectionScope";
