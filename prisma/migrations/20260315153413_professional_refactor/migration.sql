/*
  Warnings:

  - You are about to alter the column `email` on the `Admin` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `password` on the `Admin` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `Admin` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `ipAddress` on the `Click` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `CommunityGoal` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `nameEn` on the `CommunityGoal` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `name` on the `Discipline` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `nameEn` on the `Discipline` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `disciplinesOther` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `industry` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `occupation` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `occupationOther` on the `Member` table. All the data in the column will be lost.
  - You are about to alter the column `firstName` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `lastName` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `city` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `phone` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `email` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `accountHolderName` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `iban` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `companyName` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `companyRole` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - The `horseExperienceLevel` column on the `Member` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `slug` on the `TrackableUrl` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `name` on the `TrackableUrl` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - Added the required column `updatedAt` to the `CommunityGoal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Discipline` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TrackableUrl` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HorseExperienceLevel" AS ENUM ('ACTIVE', 'FAN');

-- DropIndex
DROP INDEX "Click_ipAddress_idx";

-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Click" DROP COLUMN "ipAddress",
ADD COLUMN     "ipAddressHash" VARCHAR(64);

-- AlterTable
ALTER TABLE "CommunityGoal" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "nameEn" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Discipline" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isPredefined" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "nameEn" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "disciplinesOther",
DROP COLUMN "industry",
DROP COLUMN "occupation",
DROP COLUMN "occupationOther",
ADD COLUMN     "acceptedById" TEXT,
ADD COLUMN     "dataRetentionUntil" TIMESTAMP(3),
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "industryId" TEXT,
ADD COLUMN     "occupationId" TEXT,
ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "accountHolderName" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "iban" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "companyName" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "companyRole" SET DATA TYPE VARCHAR(100),
DROP COLUMN "horseExperienceLevel",
ADD COLUMN     "horseExperienceLevel" "HorseExperienceLevel";

-- AlterTable
ALTER TABLE "TrackableUrl" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(200);

-- CreateTable
CREATE TABLE "Occupation" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "nameEn" VARCHAR(100),
    "requiresWorkDetails" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Occupation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Industry" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "nameEn" VARCHAR(100),
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Occupation_name_key" ON "Occupation"("name");

-- CreateIndex
CREATE INDEX "Occupation_order_idx" ON "Occupation"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Industry_name_key" ON "Industry"("name");

-- CreateIndex
CREATE INDEX "Industry_order_idx" ON "Industry"("order");

-- CreateIndex
CREATE INDEX "Click_ipAddressHash_idx" ON "Click"("ipAddressHash");

-- CreateIndex
CREATE INDEX "Discipline_isPredefined_idx" ON "Discipline"("isPredefined");

-- CreateIndex
CREATE INDEX "Member_status_createdAt_idx" ON "Member"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Member_hasHorseExperience_status_idx" ON "Member"("hasHorseExperience", "status");

-- CreateIndex
CREATE INDEX "Member_deletedAt_idx" ON "Member"("deletedAt");

-- CreateIndex
CREATE INDEX "Member_occupationId_idx" ON "Member"("occupationId");

-- CreateIndex
CREATE INDEX "Member_industryId_idx" ON "Member"("industryId");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_occupationId_fkey" FOREIGN KEY ("occupationId") REFERENCES "Occupation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_acceptedById_fkey" FOREIGN KEY ("acceptedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
