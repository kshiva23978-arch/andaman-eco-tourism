-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'CONTENT_EDITOR', 'REVIEWER', 'VIEWER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INVITED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('PUBLISHED', 'DRAFT');

-- CreateEnum
CREATE TYPE "LabelSide" AS ENUM ('LEFT', 'RIGHT');

-- CreateEnum
CREATE TYPE "SectionScope" AS ENUM ('HOME', 'DESTINATIONS_LISTING', 'ACTIVITIES_LISTING', 'EVERY_PAGE', 'DESTINATION_ITEM', 'ACTIVITY_ITEM');

-- CreateEnum
CREATE TYPE "BackgroundType" AS ENUM ('IMAGE', 'COLOR');

-- CreateEnum
CREATE TYPE "LogCategory" AS ENUM ('AUTH', 'CONTENT', 'SECURITY', 'SYSTEM');

-- CreateEnum
CREATE TYPE "LogSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CONTENT_EDITOR',
    "status" "UserStatus" NOT NULL DEFAULT 'INVITED',
    "lastActiveAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "ip" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "rangeDivision" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "accessRoad" TEXT NOT NULL,
    "accessShip" TEXT NOT NULL,
    "bestTime" TEXT NOT NULL,
    "timing" TEXT NOT NULL,
    "permits" TEXT NOT NULL,
    "fees" TEXT NOT NULL,
    "activities" TEXT[],
    "facility" TEXT[],
    "accommodation" TEXT NOT NULL,
    "hospital" TEXT NOT NULL,
    "nearbyPlaces" TEXT[],
    "conservationNotes" TEXT NOT NULL,
    "ecoGuidelines" TEXT[],
    "safetyTips" TEXT[],
    "whatToSee" TEXT[],
    "image" TEXT NOT NULL,
    "heroImagePosition" TEXT,
    "galleryImages" TEXT[],
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "overview" TEXT[],
    "duration" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "equipmentProvided" TEXT[],
    "permitNote" TEXT NOT NULL,
    "destinationSlugs" TEXT[],
    "relatedActivitySlugs" TEXT[],
    "guideBody" TEXT NOT NULL,
    "guideBullets" TEXT[],
    "galleryImages" TEXT[],
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityGuideline" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ActivityGuideline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapPin" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "dir" "LabelSide" NOT NULL DEFAULT 'RIGHT',
    "approx" BOOLEAN NOT NULL DEFAULT false,
    "destinationId" TEXT,

    CONSTRAINT "MapPin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scope" "SectionScope" NOT NULL,
    "targetType" TEXT,
    "targetSlug" TEXT,
    "targetTitle" TEXT,
    "headline" TEXT,
    "body" TEXT,
    "backgroundType" "BackgroundType" NOT NULL DEFAULT 'IMAGE',
    "backgroundImage" TEXT,
    "backgroundColor" TEXT,
    "overlayEnabled" BOOLEAN NOT NULL DEFAULT true,
    "overlayColor" TEXT NOT NULL DEFAULT '#000000',
    "overlayOpacity" INTEGER NOT NULL DEFAULT 45,
    "gallery" TEXT[],
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "usedIn" TEXT,
    "sizeBytes" INTEGER,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "actorLabel" TEXT NOT NULL,
    "ip" TEXT,
    "category" "LogCategory" NOT NULL,
    "severity" "LogSeverity" NOT NULL DEFAULT 'INFO',
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "Destination_slug_key" ON "Destination"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_slug_key" ON "Activity"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MapPin_destinationId_key" ON "MapPin"("destinationId");

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_path_key" ON "MediaAsset"("path");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityGuideline" ADD CONSTRAINT "ActivityGuideline_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapPin" ADD CONSTRAINT "MapPin_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
