/*
  Warnings:

  - The `required_skills` column on the `job_listings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "job_listings" DROP COLUMN "required_skills",
ADD COLUMN  "required_skills" TEXT[];

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "full_name" DROP NOT NULL;
