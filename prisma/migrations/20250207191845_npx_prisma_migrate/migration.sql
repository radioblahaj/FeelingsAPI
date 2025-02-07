-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slackId" TEXT NOT NULL,
    "key" TEXT DEFAULT 'orpheus'
);

-- CreateTable
CREATE TABLE "Friend" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "friendId" TEXT NOT NULL,
    CONSTRAINT "Friend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_feelings" (
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
INSERT INTO "new_feelings" ("category", "category2", "date", "feeling", "feeling2", "id", "note", "share") SELECT "category", "category2", "date", "feeling", "feeling2", "id", "note", "share" FROM "feelings";
DROP TABLE "feelings";
ALTER TABLE "new_feelings" RENAME TO "feelings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_slackId_key" ON "User"("slackId");
