/*
  Warnings:

  - A unique constraint covering the columns `[classification_id]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `folder_id` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "classification_id" TEXT,
ADD COLUMN     "folder_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "posts_classification_id_key" ON "posts"("classification_id");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_classification_id_fkey" FOREIGN KEY ("classification_id") REFERENCES "ai_classifications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
