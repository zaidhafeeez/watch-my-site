-- DropForeignKey
ALTER TABLE "StatusCheck" DROP CONSTRAINT "StatusCheck_siteId_fkey";

-- AlterTable
ALTER TABLE "StatusCheck" ADD COLUMN     "dnsInfo" JSONB,
ADD COLUMN     "error" TEXT,
ADD COLUMN     "headers" JSONB,
ADD COLUMN     "sslInfo" JSONB,
ADD COLUMN     "statusCode" INTEGER;

-- CreateIndex
CREATE INDEX "StatusCheck_siteId_idx" ON "StatusCheck"("siteId");

-- CreateIndex
CREATE INDEX "StatusCheck_timestamp_idx" ON "StatusCheck"("timestamp");

-- AddForeignKey
ALTER TABLE "StatusCheck" ADD CONSTRAINT "StatusCheck_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
