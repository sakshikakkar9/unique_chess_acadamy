-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "email" TEXT,
ADD COLUMN     "fideId" TEXT,
ADD COLUMN     "fideRating" INTEGER,
ADD COLUMN     "discoverySource" TEXT;

-- AlterTable
ALTER TABLE "CourseEnrollment" ADD COLUMN     "discoverySource" TEXT;
