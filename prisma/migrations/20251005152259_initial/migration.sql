-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('GameCreated', 'PlayerAdded', 'GameStarted', 'TurnStarted', 'DartThrown', 'GameOver', 'LegStarted', 'LegWon');

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameEvent" (
    "id" TEXT NOT NULL,
    "created_by" TEXT,
    "gameId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "type" "EventType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameEvent_pkey" PRIMARY KEY ("id")
);
