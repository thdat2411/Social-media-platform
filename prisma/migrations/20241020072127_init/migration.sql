/*
  Warnings:

  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_user_id_fkey";

-- DropTable
DROP TABLE "Like";

-- CreateTable
CREATE TABLE "like" (
    "id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_preference" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "job_titles" TEXT[],
    "location_type" TEXT[],
    "location_on_site" TEXT,
    "location_remote" TEXT,
    "start_date" TEXT,
    "employment_types" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_preference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "like_comment_id_key" ON "like"("comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_preference_user_id_key" ON "job_preference"("user_id");

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_preference" ADD CONSTRAINT "job_preference_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
