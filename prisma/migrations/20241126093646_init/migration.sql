/*
  Warnings:

  - You are about to drop the column `bio` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "bio",
DROP COLUMN "location",
ADD COLUMN     "address" VARCHAR(255),
ADD COLUMN     "headline" TEXT;
