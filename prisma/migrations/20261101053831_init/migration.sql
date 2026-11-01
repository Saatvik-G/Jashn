-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventDate" DATETIME NOT NULL,
    "guestCount" INTEGER NOT NULL,
    "totalBudget" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "location" TEXT NOT NULL,
    "notes" TEXT,
    "theme" TEXT,
    "shareToken" TEXT,
    "shareTokenExpiry" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BudgetItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "allocatedAmount" REAL NOT NULL,
    "spentAmount" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    CONSTRAINT "BudgetItem_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TimelineTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "offsetDays" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "isCriticalPath" BOOLEAN NOT NULL DEFAULT false,
    "dependencies" TEXT,
    "notes" TEXT,
    CONSTRAINT "TimelineTask_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VendorCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "checklistJson" TEXT NOT NULL,
    CONSTRAINT "VendorCategory_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VendorQuote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vendorCategoryId" TEXT NOT NULL,
    "vendorName" TEXT NOT NULL,
    "contactPerson" TEXT,
    "contactInfo" TEXT,
    "quotedAmount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "weightedScore" REAL NOT NULL DEFAULT 0,
    "criteriaScores" TEXT,
    "notes" TEXT,
    CONSTRAINT "VendorQuote_vendorCategoryId_fkey" FOREIGN KEY ("vendorCategoryId") REFERENCES "VendorCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IdeaItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "minCost" REAL NOT NULL,
    "maxCost" REAL NOT NULL,
    "isAdded" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "IdeaItem_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "beforeSnapshot" TEXT NOT NULL,
    "afterSnapshot" TEXT NOT NULL,
    "appliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_shareToken_key" ON "Event"("shareToken");

-- CreateIndex
CREATE INDEX "BudgetItem_eventId_idx" ON "BudgetItem"("eventId");

-- CreateIndex
CREATE INDEX "TimelineTask_eventId_idx" ON "TimelineTask"("eventId");

-- CreateIndex
CREATE INDEX "VendorCategory_eventId_idx" ON "VendorCategory"("eventId");

-- CreateIndex
CREATE INDEX "VendorQuote_vendorCategoryId_idx" ON "VendorQuote"("vendorCategoryId");

-- CreateIndex
CREATE INDEX "IdeaItem_eventId_idx" ON "IdeaItem"("eventId");

-- CreateIndex
CREATE INDEX "AuditLog_eventId_idx" ON "AuditLog"("eventId");
