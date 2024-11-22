/*
  Warnings:

  - You are about to drop the column `comment_id` on the `like` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `like` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,entity_type,entity_id]` on the table `like` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `entity_id` to the `like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entity_type` to the `like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `like` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "like" DROP CONSTRAINT "like_comment_id_fkey";

-- DropIndex
DROP INDEX "like_comment_id_key";

-- AlterTable
ALTER TABLE "like" DROP COLUMN "comment_id",
DROP COLUMN "userId",
ADD COLUMN     "commentId" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "entity_id" TEXT NOT NULL,
ADD COLUMN     "entity_type" VARCHAR(50) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "like_user_id_entity_type_entity_id_key" ON "like"("user_id", "entity_type", "entity_id");

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
