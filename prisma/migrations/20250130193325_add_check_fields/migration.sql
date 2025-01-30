/*
  Warnings:

  - You are about to drop the column `uptime` on the `Site` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Site" DROP COLUMN "uptime",
ADD COLUMN     "successfulChecks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalChecks" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT 'checking';
