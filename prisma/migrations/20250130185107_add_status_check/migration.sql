-- CreateTable
CREATE TABLE "StatusCheck" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responseTime" INTEGER NOT NULL,

    CONSTRAINT "StatusCheck_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StatusCheck" ADD CONSTRAINT "StatusCheck_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
