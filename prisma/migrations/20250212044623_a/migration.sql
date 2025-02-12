-- CreateTable
CREATE TABLE "feelings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME,
    "feeling" TEXT,
    "note" TEXT,
    "userId" TEXT,
    "feeling2" TEXT,
    "share" BOOLEAN DEFAULT false,
    "category" TEXT,
    "category2" TEXT,
    CONSTRAINT "feelings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("slackId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slackId" TEXT NOT NULL,
    "key" TEXT DEFAULT 'orpheus',
    "channel" TEXT
);

-- CreateTable
CREATE TABLE "Friend" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    CONSTRAINT "Friend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("slackId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_slackId_key" ON "User"("slackId");
