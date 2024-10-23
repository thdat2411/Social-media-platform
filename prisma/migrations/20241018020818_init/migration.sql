/*
  Warnings:

  - You are about to drop the column `profile_image_url` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "profile_image_url",
ADD COLUMN     "emailVerified" TIMESTAMP(6),
ADD COLUMN     "image" TEXT;
