/*
  Warnings:

  - You are about to drop the column `previe_url` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "post" DROP COLUMN "previe_url",
ADD COLUMN     "preview_url" TEXT;
