-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "HorseExperienceLevel" AS ENUM ('ACTIVE', 'FAN');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DENIED');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "accountHolderName" VARCHAR(200) NOT NULL,
    "iban" VARCHAR(500) NOT NULL,
    "occupationId" TEXT,
    "industryId" TEXT,
    "companyName" VARCHAR(200),
    "companyRole" VARCHAR(100),
    "hasHorseExperience" BOOLEAN NOT NULL,
    "horseExperienceLevel" "HorseExperienceLevel",
    "wantsToDiscover" BOOLEAN,
    "funAnswer" TEXT NOT NULL,
    "consentGiven" BOOLEAN NOT NULL DEFAULT true,
    "status" "MemberStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "acceptedById" TEXT,
    "deletedAt" TIMESTAMP(3),
    "dataRetentionUntil" TIMESTAMP(3),

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Occupation" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "nameEn" VARCHAR(100),
    "requiresWorkDetails" BOOLEAN NOT NULL DEFAULT false,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Occupation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Industry" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "nameEn" VARCHAR(100),
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discipline" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "nameEn" VARCHAR(100),
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discipline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberDiscipline" (
    "memberId" TEXT NOT NULL,
    "disciplineId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberDiscipline_pkey" PRIMARY KEY ("memberId","disciplineId")
);

-- CreateTable
CREATE TABLE "CommunityGoal" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "nameEn" VARCHAR(100),
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberCommunityGoal" (
    "memberId" TEXT NOT NULL,
    "communityGoalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberCommunityGoal_pkey" PRIMARY KEY ("memberId","communityGoalId")
);

-- CreateTable
CREATE TABLE "TrackableUrl" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackableUrl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Click" (
    "id" TEXT NOT NULL,
    "trackableUrlId" TEXT NOT NULL,
    "ipAddressHash" VARCHAR(64),
    "userAgent" TEXT,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Click_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE INDEX "Member_email_idx" ON "Member"("email");

-- CreateIndex
CREATE INDEX "Member_status_idx" ON "Member"("status");

-- CreateIndex
CREATE INDEX "Member_lastName_idx" ON "Member"("lastName");

-- CreateIndex
CREATE INDEX "Member_createdAt_idx" ON "Member"("createdAt");

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

-- CreateIndex
CREATE UNIQUE INDEX "Occupation_code_key" ON "Occupation"("code");

-- CreateIndex
CREATE INDEX "Occupation_code_idx" ON "Occupation"("code");

-- CreateIndex
CREATE INDEX "Occupation_order_idx" ON "Occupation"("order");

-- CreateIndex
CREATE INDEX "Occupation_isSystem_idx" ON "Occupation"("isSystem");

-- CreateIndex
CREATE UNIQUE INDEX "Industry_code_key" ON "Industry"("code");

-- CreateIndex
CREATE INDEX "Industry_code_idx" ON "Industry"("code");

-- CreateIndex
CREATE INDEX "Industry_order_idx" ON "Industry"("order");

-- CreateIndex
CREATE INDEX "Industry_isSystem_idx" ON "Industry"("isSystem");

-- CreateIndex
CREATE UNIQUE INDEX "Discipline_code_key" ON "Discipline"("code");

-- CreateIndex
CREATE INDEX "Discipline_code_idx" ON "Discipline"("code");

-- CreateIndex
CREATE INDEX "Discipline_order_idx" ON "Discipline"("order");

-- CreateIndex
CREATE INDEX "Discipline_isSystem_idx" ON "Discipline"("isSystem");

-- CreateIndex
CREATE INDEX "MemberDiscipline_memberId_idx" ON "MemberDiscipline"("memberId");

-- CreateIndex
CREATE INDEX "MemberDiscipline_disciplineId_idx" ON "MemberDiscipline"("disciplineId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityGoal_code_key" ON "CommunityGoal"("code");

-- CreateIndex
CREATE INDEX "CommunityGoal_code_idx" ON "CommunityGoal"("code");

-- CreateIndex
CREATE INDEX "CommunityGoal_order_idx" ON "CommunityGoal"("order");

-- CreateIndex
CREATE INDEX "CommunityGoal_isSystem_idx" ON "CommunityGoal"("isSystem");

-- CreateIndex
CREATE INDEX "MemberCommunityGoal_memberId_idx" ON "MemberCommunityGoal"("memberId");

-- CreateIndex
CREATE INDEX "MemberCommunityGoal_communityGoalId_idx" ON "MemberCommunityGoal"("communityGoalId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackableUrl_slug_key" ON "TrackableUrl"("slug");

-- CreateIndex
CREATE INDEX "TrackableUrl_slug_idx" ON "TrackableUrl"("slug");

-- CreateIndex
CREATE INDEX "Click_trackableUrlId_idx" ON "Click"("trackableUrlId");

-- CreateIndex
CREATE INDEX "Click_ipAddressHash_idx" ON "Click"("ipAddressHash");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_occupationId_fkey" FOREIGN KEY ("occupationId") REFERENCES "Occupation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_acceptedById_fkey" FOREIGN KEY ("acceptedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberDiscipline" ADD CONSTRAINT "MemberDiscipline_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberDiscipline" ADD CONSTRAINT "MemberDiscipline_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberCommunityGoal" ADD CONSTRAINT "MemberCommunityGoal_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberCommunityGoal" ADD CONSTRAINT "MemberCommunityGoal_communityGoalId_fkey" FOREIGN KEY ("communityGoalId") REFERENCES "CommunityGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_trackableUrlId_fkey" FOREIGN KEY ("trackableUrlId") REFERENCES "TrackableUrl"("id") ON DELETE CASCADE ON UPDATE CASCADE;

