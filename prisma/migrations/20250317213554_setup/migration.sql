-- CreateEnum
CREATE TYPE "Checkout" AS ENUM ('Straight', 'Double');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "checkout" "Checkout" NOT NULL DEFAULT 'Straight';
