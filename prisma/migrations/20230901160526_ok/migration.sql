/*
  Warnings:

  - You are about to drop the column `createdDate` on the `academic_departments` table. All the data in the column will be lost.
  - You are about to drop the column `updatedDate` on the `academic_departments` table. All the data in the column will be lost.
  - You are about to drop the column `createdDate` on the `academic_faculty` table. All the data in the column will be lost.
  - You are about to drop the column `updatedDate` on the `academic_faculty` table. All the data in the column will be lost.
  - You are about to drop the column `createdDate` on the `academic_semesters` table. All the data in the column will be lost.
  - You are about to drop the column `updatedDate` on the `academic_semesters` table. All the data in the column will be lost.
  - You are about to drop the column `createdDate` on the `faculties` table. All the data in the column will be lost.
  - You are about to drop the column `updatedDate` on the `faculties` table. All the data in the column will be lost.
  - You are about to drop the column `createdDate` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `updatedDate` on the `students` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "academic_departments" DROP COLUMN "createdDate",
DROP COLUMN "updatedDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "academic_faculty" DROP COLUMN "createdDate",
DROP COLUMN "updatedDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "academic_semesters" DROP COLUMN "createdDate",
DROP COLUMN "updatedDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "faculties" DROP COLUMN "createdDate",
DROP COLUMN "updatedDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "createdDate",
DROP COLUMN "updatedDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
