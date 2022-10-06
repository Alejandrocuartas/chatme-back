-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "photo" TEXT NOT NULL DEFAULT 'https://i.pinimg.com/236x/8f/86/37/8f8637791ff972927e30bef9a614867f--riwayat-hidup-montana.jpg',
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message" TEXT NOT NULL,
    "emitter_id" INTEGER NOT NULL,
    "listener_id" INTEGER NOT NULL,
    CONSTRAINT "Message_emitter_id_fkey" FOREIGN KEY ("emitter_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_listener_id_fkey" FOREIGN KEY ("listener_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
