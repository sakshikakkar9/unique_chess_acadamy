/*
  Warnings:

  - The primary key for the `ContactMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `isRead` on the `ContactMessage` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `CourseEnrollment` table. All the data in the column will be lost.
  - You are about to drop the column `dob` on the `CourseEnrollment` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `CourseEnrollment` table. All the data in the column will be lost.
  - You are about to drop the column `fideId` on the `CourseEnrollment` table. All the data in the column will be lost.
  - You are about to drop the column `fideRating` on the `CourseEnrollment` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `CourseEnrollment` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `CourseEnrollment` table. All the data in the column will be lost.
  - You are about to drop the column `studentName` on the `CourseEnrollment` table. All the data in the column will be lost.
  - The primary key for the `DemoRegistration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `address` on the `Registration` table. All the data in the column will be lost.
  - You are about to drop the column `dob` on the `Registration` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Registration` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Registration` table. All the data in the column will be lost.
  - You are about to drop the column `studentName` on the `Registration` table. All the data in the column will be lost.
  - The `status` column on the `Tournament` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `bannerUrl` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[uca_id]` on the table `CourseEnrollment` will be added. If there are existing duplicate values, this will fail.
  - Made the column `phone` on table `ContactMessage` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `studentId` to the `CourseEnrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Registration` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'VERIFIED', 'FAILED');

-- CreateEnum
CREATE TYPE "PosterOrientation" AS ENUM ('LANDSCAPE', 'PORTRAIT');

-- AlterTable
ALTER TABLE "ContactMessage" DROP CONSTRAINT "ContactMessage_pkey",
DROP COLUMN "isRead",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'unread',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DEFAULT '',
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "phone" SET DEFAULT '',
ADD CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ContactMessage_id_seq";

-- AlterTable
ALTER TABLE "CourseEnrollment" DROP COLUMN "address",
DROP COLUMN "dob",
DROP COLUMN "email",
DROP COLUMN "fideId",
DROP COLUMN "fideRating",
DROP COLUMN "gender",
DROP COLUMN "phone",
DROP COLUMN "studentName",
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "studentId" TEXT NOT NULL,
ADD COLUMN     "transactionId" TEXT,
ADD COLUMN     "uca_id" TEXT,
ALTER COLUMN "discoverySource" DROP NOT NULL;

-- AlterTable
ALTER TABLE "DemoRegistration" DROP CONSTRAINT "DemoRegistration_pkey",
ADD COLUMN     "city" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "DemoRegistration_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "DemoRegistration_id_seq";

-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "address",
DROP COLUMN "dob",
DROP COLUMN "gender",
DROP COLUMN "phone",
DROP COLUMN "studentName",
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "studentId" TEXT NOT NULL,
ALTER COLUMN "discoverySource" DROP NOT NULL,
ALTER COLUMN "fideId" DROP NOT NULL,
ALTER COLUMN "fideId" DROP DEFAULT,
ALTER COLUMN "fideRating" DROP NOT NULL,
ALTER COLUMN "fideRating" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "posterOrientation" "PosterOrientation" NOT NULL DEFAULT 'LANDSCAPE',
ADD COLUMN     "regEndDate" TIMESTAMP(3),
ADD COLUMN     "regStartDate" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "bannerUrl",
ADD COLUMN     "brochureUrl" TEXT,
ADD COLUMN     "custom_banner_url" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "enrollmentEnd" TIMESTAMP(3),
ADD COLUMN     "enrollmentStart" TIMESTAMP(3),
ADD COLUMN     "posterOrientation" "PosterOrientation" NOT NULL DEFAULT 'LANDSCAPE',
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "status" TEXT;

-- DropTable
DROP TABLE "Event";

-- DropEnum
DROP TYPE "EventCategory";

-- CreateTable
CREATE TABLE "GlobalSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "upiScannerUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "fideId" TEXT DEFAULT 'NA',
    "fideRating" INTEGER DEFAULT 0,
    "clubAffiliation" TEXT,
    "experienceLevel" TEXT,
    "preferredBatch" TEXT,
    "discoverySource" TEXT,
    "accountStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_phone_key" ON "Student"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "CourseEnrollment_uca_id_key" ON "CourseEnrollment"("uca_id");

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
