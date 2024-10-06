DELETE FROM "user" WHERE deleted = true;
ALTER TABLE "user" DROP COLUMN IF EXISTS deleted;

