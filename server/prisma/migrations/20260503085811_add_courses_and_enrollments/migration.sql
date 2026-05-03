/*
  Warnings:

  - The `category` column on the `Gallery` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `date` on the `Tournament` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[referenceId]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ageProofUrl` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discoverySource` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dob` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentProofUrl` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - The required column `referenceId` was added to the `Registration` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `startDate` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'GRANDMASTER');

-- CreateEnum
CREATE TYPE "ClassMode" AS ENUM ('ONLINE', 'OFFLINE', 'HYBRID');

-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('CHILDREN', 'TEENAGERS', 'ADULTS');

-- DropForeignKey
ALTER TABLE "Registration" DROP CONSTRAINT "Registration_tournamentId_fkey";

-- AlterTable
ALTER TABLE "Gallery" DROP COLUMN "category",
ADD COLUMN     "category" "GalleryCategory" NOT NULL DEFAULT 'ACADEMY';

-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "ageProofUrl" TEXT NOT NULL,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "discoverySource" TEXT NOT NULL,
ADD COLUMN     "dob" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fideId" TEXT NOT NULL DEFAULT 'NA',
ADD COLUMN     "fideRating" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "paymentProofUrl" TEXT NOT NULL,
ADD COLUMN     "referenceId" TEXT NOT NULL,
ADD COLUMN     "transactionId" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "date",
ADD COLUMN     "brochureUrl" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "contactDetails" TEXT,
ADD COLUMN     "discountDetails" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "otherDetails" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "totalPrizePool" TEXT;

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "skillLevel" "SkillLevel" NOT NULL DEFAULT 'BEGINNER',
    "classTime" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL,
    "days" TEXT[],
    "contactDetails" TEXT NOT NULL,
    "mode" "ClassMode" NOT NULL DEFAULT 'ONLINE',
    "bannerUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseEnrollment" (
    "id" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "category" TEXT,
    "dob" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "fideId" TEXT NOT NULL DEFAULT 'NA',
    "fideRating" INTEGER NOT NULL DEFAULT 0,
    "address" TEXT NOT NULL,
    "ageProofUrl" TEXT NOT NULL,
    "paymentProofUrl" TEXT NOT NULL,
    "discoverySource" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseEnrollment_referenceId_key" ON "CourseEnrollment"("referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_referenceId_key" ON "Registration"("referenceId");

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
