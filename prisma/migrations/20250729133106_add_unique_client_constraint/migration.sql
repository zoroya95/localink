/*
  Warnings:

  - A unique constraint covering the columns `[userId,nomEntreprise]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_nomEntreprise_key" ON "Client"("userId", "nomEntreprise");
