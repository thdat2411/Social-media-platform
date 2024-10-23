/*
  Warnings:

  - You are about to drop the column `headline` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "like" DROP CONSTRAINT "like_userId_fkey";

-- AlterTable
ALTER TABLE "job_preference" ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "headline",
ADD COLUMN     "birth_date" TIMESTAMP(3),
ADD COLUMN     "headline_image" VARCHAR(255),
ADD COLUMN     "phone_number" INTEGER;
