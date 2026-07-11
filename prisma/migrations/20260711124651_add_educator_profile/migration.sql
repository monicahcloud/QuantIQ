-- CreateTable
CREATE TABLE "EducatorProfile" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "schoolName" TEXT,
    "teacherRole" TEXT,
    "country" TEXT,
    "curriculum" TEXT,
    "examFocus" TEXT,
    "teachingGoals" TEXT,
    "gradeLevels" TEXT[],
    "subjects" TEXT[],
    "classSize" INTEGER,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducatorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EducatorProfile_clerkUserId_key" ON "EducatorProfile"("clerkUserId");
