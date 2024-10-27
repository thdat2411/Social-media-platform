/*
  Warnings:

  - You are about to drop the `job_listing` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "job_application" DROP CONSTRAINT "job_application_job_listing_id_fkey";

-- DropForeignKey
ALTER TABLE "job_listing" DROP CONSTRAINT "job_listing_employer_id_fkey";

-- DropTable
DROP TABLE "job_listing";

-- CreateTable
CREATE TABLE "job_posting" (
    "id" TEXT NOT NULL,
    "employer_id" TEXT,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "location" VARCHAR(255),
    "workplace_type" VARCHAR(50),
    "job_type" VARCHAR(50),
    "level" VARCHAR(50),
    "salary_range" VARCHAR(100),
    "required_skills" TEXT[],
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_posting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "job_application" ADD CONSTRAINT "job_application_job_listing_id_fkey" FOREIGN KEY ("job_listing_id") REFERENCES "job_posting"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job_posting" ADD CONSTRAINT "job_posting_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
