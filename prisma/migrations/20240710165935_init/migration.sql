-- CreateEnum
CREATE TYPE "FolderType" AS ENUM ('custom', 'default');

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(40) NOT NULL,
    "deviceToken" VARCHAR(20) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folders" (
    "id" VARCHAR(40) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "type" "FolderType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" VARCHAR(40) NOT NULL,
    "url" VARCHAR(2048) NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "description" VARCHAR(3000),
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_classifications" (
    "id" VARCHAR(40) NOT NULL,
    "url" VARCHAR(2048) NOT NULL,
    "description" VARCHAR(3000),
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "suggested_folder_id" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "ai_classifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_keywords" (
    "id" VARCHAR(40) NOT NULL,
    "post_id" TEXT NOT NULL,
    "keyword_id" TEXT NOT NULL,

    CONSTRAINT "post_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keywords" (
    "id" VARCHAR(40) NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "keywords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_deviceToken_key" ON "users"("deviceToken");

-- CreateIndex
CREATE UNIQUE INDEX "folders_name_user_id_key" ON "folders"("name", "user_id");

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_classifications" ADD CONSTRAINT "ai_classifications_suggested_folder_id_fkey" FOREIGN KEY ("suggested_folder_id") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_classifications" ADD CONSTRAINT "ai_classifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_keywords" ADD CONSTRAINT "post_keywords_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_keywords" ADD CONSTRAINT "post_keywords_keyword_id_fkey" FOREIGN KEY ("keyword_id") REFERENCES "keywords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
