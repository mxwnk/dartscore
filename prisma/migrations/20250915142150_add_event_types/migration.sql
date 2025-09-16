-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventType" ADD VALUE 'GameStarted';
ALTER TYPE "EventType" ADD VALUE 'TurnStarted';
ALTER TYPE "EventType" ADD VALUE 'PlayerWon';

-- AlterTable
ALTER TABLE "GameEvent" ADD COLUMN     "created_by" TEXT;
