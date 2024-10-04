/*
  Warnings:

  - Added the required column `time` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `schedule` ADD COLUMN `time` VARCHAR(191) NOT NULL;
