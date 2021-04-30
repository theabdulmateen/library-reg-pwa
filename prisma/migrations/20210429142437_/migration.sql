/*
  Warnings:

  - You are about to drop the column `isCheckedIn` on the `User` table. All the data in the column will be lost.
  - Added the required column `userIdentifier` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "userIdentifier" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isCheckedIn",
ADD COLUMN     "checkInId" INTEGER;
