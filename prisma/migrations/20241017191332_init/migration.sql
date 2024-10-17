/*
  Warnings:

  - You are about to drop the column `employment_type` on the `job_listings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "job_listings" DROP COLUMN "employment_type",
ADD COLUMN     "job_type" VARCHAR(50),
ADD COLUMN     "level" VARCHAR(50),
ADD COLUMN     "workplace_type" VARCHAR(50);
