-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "job_posting_id" TEXT,
ADD COLUMN     "post_id" TEXT;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_job_posting_id_fkey" FOREIGN KEY ("job_posting_id") REFERENCES "job_posting"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
