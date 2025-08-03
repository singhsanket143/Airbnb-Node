/*
  Warnings:

  - You are about to drop the column `bookingAmount` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `checkInDate` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkOutDate` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerNight` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalNights` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add new columns as nullable first
ALTER TABLE `Booking` 
    ADD COLUMN `checkInDate` DATETIME(3) NULL,
    ADD COLUMN `checkOutDate` DATETIME(3) NULL,
    ADD COLUMN `pricePerNight` INTEGER NULL,
    ADD COLUMN `roomId` INTEGER NULL,
    ADD COLUMN `totalAmount` INTEGER NULL,
    ADD COLUMN `totalNights` INTEGER NULL;

-- Step 2: Update existing records with default values
UPDATE `Booking` SET 
    `checkInDate` = NOW(),
    `checkOutDate` = DATE_ADD(NOW(), INTERVAL 1 DAY),
    `pricePerNight` = 100,
    `roomId` = 1,
    `totalAmount` = `bookingAmount`,
    `totalNights` = 1;

-- Step 3: Make columns NOT NULL
ALTER TABLE `Booking` 
    MODIFY COLUMN `checkInDate` DATETIME(3) NOT NULL,
    MODIFY COLUMN `checkOutDate` DATETIME(3) NOT NULL,
    MODIFY COLUMN `pricePerNight` INTEGER NOT NULL,
    MODIFY COLUMN `roomId` INTEGER NOT NULL,
    MODIFY COLUMN `totalAmount` INTEGER NOT NULL,
    MODIFY COLUMN `totalNights` INTEGER NOT NULL;

-- Step 4: Drop the old bookingAmount column
ALTER TABLE `Booking` DROP COLUMN `bookingAmount`;
