-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "lastChecked" TIMESTAMP(3),
ADD COLUMN     "nextCheckAt" TIMESTAMP(3);
