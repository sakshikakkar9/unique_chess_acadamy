-- CreateTable
CREATE TABLE "DemoRegistration" (
    "id" SERIAL NOT NULL,
    "studentName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemoRegistration_pkey" PRIMARY KEY ("id")
);
