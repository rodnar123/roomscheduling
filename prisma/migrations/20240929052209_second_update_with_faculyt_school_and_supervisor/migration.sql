-- CreateTable
CREATE TABLE `Supervisor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `fuculty` ENUM('ARTS_HUMANITIES', 'NATURAL_SCIENCE', 'PHYSICAL_SCIENCE', 'ENGINEERING') NOT NULL,
    `school` ENUM('COMMUNICATION_FOR_DEVELOPMENT', 'BUSINESS', 'COMPUTER_SCIENCE', 'MECHANICAL', 'ELECTRICAL', 'APPLIED_PHYSICS', 'MINING', 'CIVIL', 'FORESTRY', 'AGRICULTURE', 'LANDS_AND_SURVEY', 'APPLIED_SCIENCE', 'ACRCHITECTURE_AND_COSTRUCTION') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RoomToSupervisor` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RoomToSupervisor_AB_unique`(`A`, `B`),
    INDEX `_RoomToSupervisor_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CourseToSupervisor` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CourseToSupervisor_AB_unique`(`A`, `B`),
    INDEX `_CourseToSupervisor_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_RoomToSupervisor` ADD CONSTRAINT `_RoomToSupervisor_A_fkey` FOREIGN KEY (`A`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoomToSupervisor` ADD CONSTRAINT `_RoomToSupervisor_B_fkey` FOREIGN KEY (`B`) REFERENCES `Supervisor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseToSupervisor` ADD CONSTRAINT `_CourseToSupervisor_A_fkey` FOREIGN KEY (`A`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseToSupervisor` ADD CONSTRAINT `_CourseToSupervisor_B_fkey` FOREIGN KEY (`B`) REFERENCES `Supervisor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
