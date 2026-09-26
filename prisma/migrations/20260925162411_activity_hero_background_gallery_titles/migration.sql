-- AlterEnum
ALTER TYPE "BackgroundType" ADD VALUE 'PLAIN';

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "galleryTitles" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "heroBackgroundColor" TEXT,
ADD COLUMN     "heroBackgroundType" "BackgroundType" NOT NULL DEFAULT 'IMAGE',
ADD COLUMN     "heroOverlayColor" TEXT NOT NULL DEFAULT '#000000',
ADD COLUMN     "heroOverlayEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "heroOverlayOpacity" INTEGER NOT NULL DEFAULT 45;
