/*
  Warnings:

  - Made the column `birthday` on table `patients` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "members" ADD COLUMN     "appointmentAmount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "appointmentAmount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "birthday" SET NOT NULL,
ALTER COLUMN "birthday" SET DATA TYPE TIMESTAMP(3);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "consultationContent" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
