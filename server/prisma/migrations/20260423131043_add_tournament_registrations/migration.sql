/*
  Warnings:

  - The primary key for the `Gallery` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `results` on the `Tournament` table. All the data in the column will be lost.
  - The `status` column on the `Tournament` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Made the column `category` on table `Gallery` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('CLASS', 'WORKSHOP');

-- CreateEnum
CREATE TYPE "GalleryCategory" AS ENUM ('TRAINING', 'TOURNAMENT', 'COACHING', 'ACADEMY');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Gallery" DROP CONSTRAINT "Gallery_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "category" SET DEFAULT 'ACADEMY',
ADD CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Gallery_id_seq";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "results",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TournamentStatus" NOT NULL DEFAULT 'UPCOMING';

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "category" "EventCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentResult" (
    "id" SERIAL NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "playerName" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "prize" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TournamentResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TournamentResult" ADD CONSTRAINT "TournamentResult_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
