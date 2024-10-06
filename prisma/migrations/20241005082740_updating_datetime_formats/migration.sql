/*
  Warnings:

  - You are about to alter the column `date` on the `schedule` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `endTime` on the `schedule` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `startTime` on the `schedule` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `schedule` MODIFY `date` DATETIME(3) NOT NULL,
    MODIFY `endTime` DATETIME(3) NOT NULL,
    MODIFY `startTime` DATETIME(3) NOT NULL;
