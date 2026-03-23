-- Drop existing unique constraints on users.email and users.phoneNumber so that
-- deleted users (status = 'DELETED') can keep their email/phone and new users can reuse them.
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_email_key";
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_phoneNumber_key";

-- Email unique only among non-deleted users (global filter for uniqueness).
CREATE UNIQUE INDEX "users_email_not_deleted_key" ON "users" ("email") WHERE "status" != 'DELETED';

-- Phone number unique only among non-deleted users and when not null.
CREATE UNIQUE INDEX "users_phoneNumber_not_deleted_key" ON "users" ("phoneNumber") WHERE "status" != 'DELETED' AND "phoneNumber" IS NOT NULL;
