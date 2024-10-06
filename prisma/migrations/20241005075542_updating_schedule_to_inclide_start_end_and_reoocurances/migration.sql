/*
  Warnings:

  - You are about to drop the column `time` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `timeSlot` on the `schedule` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `time`,
    DROP COLUMN `timeSlot`,
    ADD COLUMN `endTime` DATETIME(3) NOT NULL,
    ADD COLUMN `isRecurring` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `recurrence` ENUM('WEEKLY', 'MONTHLY') NULL,
    ADD COLUMN `startTime` DATETIME(3) NOT NULL;
