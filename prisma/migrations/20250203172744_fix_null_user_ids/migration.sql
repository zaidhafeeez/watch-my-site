
-- First, handle the NULL values by either:
-- Option 1: Delete records with NULL userId
DELETE FROM "Site" WHERE "userId" IS NULL;

-- OR Option 2: Update NULL values to a default user ID (recommended if you want to keep the data)
-- UPDATE "Site" SET "userId" = 'default_user_id' WHERE "userId" IS NULL;

-- Then in a separate transaction, add the NOT NULL constraint
BEGIN;
  -- Add the NOT NULL constraint
  ALTER TABLE "Site" ALTER COLUMN "userId" SET NOT NULL;
COMMIT;