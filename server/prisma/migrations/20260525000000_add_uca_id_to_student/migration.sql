-- UCA ID Migration
-- Up Migration
-- AlterTable
ALTER TABLE "Student" ADD COLUMN "uca_id" VARCHAR(20);

-- CreateIndex
CREATE UNIQUE INDEX "Student_uca_id_key" ON "Student"("uca_id");

-- Down Migration (In comments for reference as Prisma migrations are usually incremental)
-- DROP INDEX "Student_uca_id_key";
-- ALTER TABLE "Student" DROP COLUMN "uca_id";
