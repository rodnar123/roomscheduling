/*
  Warnings:

  - You are about to drop the `_coursetosupervisor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_roomtosupervisor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_scheduletouser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `supervisor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `facultyId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_coursetosupervisor` DROP FOREIGN KEY `_CourseToSupervisor_A_fkey`;

-- DropForeignKey
ALTER TABLE `_coursetosupervisor` DROP FOREIGN KEY `_CourseToSupervisor_B_fkey`;

-- DropForeignKey
ALTER TABLE `_roomtosupervisor` DROP FOREIGN KEY `_RoomToSupervisor_A_fkey`;

-- DropForeignKey
ALTER TABLE `_roomtosupervisor` DROP FOREIGN KEY `_RoomToSupervisor_B_fkey`;

-- DropForeignKey
ALTER TABLE `_scheduletouser` DROP FOREIGN KEY `_ScheduleToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_scheduletouser` DROP FOREIGN KEY `_ScheduleToUser_B_fkey`;

-- AlterTable
ALTER TABLE `course` ADD COLUMN `facultyId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_coursetosupervisor`;

-- DropTable
DROP TABLE `_roomtosupervisor`;

-- DropTable
DROP TABLE `_scheduletouser`;

-- DropTable
DROP TABLE `supervisor`;

-- CreateTable
CREATE TABLE `School` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Faculty` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `schoolId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Faculty` ADD CONSTRAINT `Faculty_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `School`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `Faculty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
