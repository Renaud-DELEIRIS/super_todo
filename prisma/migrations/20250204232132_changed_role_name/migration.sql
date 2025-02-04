/*
  Warnings:

  - The values [ADMIN,MEMBER] on the enum `BoardRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BoardRole_new" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');
ALTER TABLE "BoardAccess" ALTER COLUMN "role" TYPE "BoardRole_new" USING ("role"::text::"BoardRole_new");
ALTER TYPE "BoardRole" RENAME TO "BoardRole_old";
ALTER TYPE "BoardRole_new" RENAME TO "BoardRole";
DROP TYPE "BoardRole_old";
COMMIT;
