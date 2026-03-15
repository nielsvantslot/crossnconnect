-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DENIED');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
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
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "city" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "occupationOther" TEXT,
    "industry" TEXT,
    "companyName" TEXT,
    "companyRole" TEXT,
    "hasHorseExperience" BOOLEAN NOT NULL,
    "horseExperienceLevel" TEXT,
    "wantsToDiscover" BOOLEAN,
    "disciplinesOther" TEXT,
    "funAnswer" TEXT NOT NULL,
    "consentGiven" BOOLEAN NOT NULL DEFAULT true,
    "status" "MemberStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discipline" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

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
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

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
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackableUrl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Click" (
    "id" TEXT NOT NULL,
    "trackableUrlId" TEXT NOT NULL,
    "ipAddress" TEXT,
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
CREATE UNIQUE INDEX "Discipline_name_key" ON "Discipline"("name");

-- CreateIndex
CREATE INDEX "Discipline_order_idx" ON "Discipline"("order");

-- CreateIndex
CREATE INDEX "MemberDiscipline_memberId_idx" ON "MemberDiscipline"("memberId");

-- CreateIndex
CREATE INDEX "MemberDiscipline_disciplineId_idx" ON "MemberDiscipline"("disciplineId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityGoal_name_key" ON "CommunityGoal"("name");

-- CreateIndex
CREATE INDEX "CommunityGoal_order_idx" ON "CommunityGoal"("order");

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
CREATE INDEX "Click_ipAddress_idx" ON "Click"("ipAddress");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
