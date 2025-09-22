/*
  Warnings:

  - A unique constraint covering the columns `[thai_id]` on the table `InitUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InitUser_thai_id_key" ON "public"."InitUser"("thai_id");
