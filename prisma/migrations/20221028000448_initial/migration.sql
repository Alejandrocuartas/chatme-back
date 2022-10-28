-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "photo" TEXT NOT NULL DEFAULT 'https://i.pinimg.com/236x/8f/86/37/8f8637791ff972927e30bef9a614867f--riwayat-hidup-montana.jpg',
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "emitter_id" INTEGER NOT NULL,
    "listener_id" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_emitter_id_fkey" FOREIGN KEY ("emitter_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_listener_id_fkey" FOREIGN KEY ("listener_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
