-- Create cpa schema
CREATE SCHEMA `cpa`;

-- Create tables (client, category, tax_return, workload)
CREATE TABLE `client` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `phone_number` VARCHAR(15),
    `address` TEXT
);

CREATE TABLE `category` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL UNIQUE,
    `description` TEXT
);

CREATE TABLE `tax_return` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `client_id` INT NOT NULL,
    `category_id` INT,
    `year` YEAR NOT NULL,
    `return_status` ENUM('Pending', 'Filed', 'Amended') DEFAULT 'Pending',
    `filing_date` DATE,
    `total_income` DECIMAL(15,2),
    `tax_paid` DECIMAL(15,2),

    -- Foreign Key Constraints
    CONSTRAINT `fk_client`
        FOREIGN KEY (`client_id`) REFERENCES `Clients`(`id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_category`
        FOREIGN KEY (`category_id`) REFERENCES `Categories`(`id`)
        ON DELETE SET NULL
);

CREATE TABLE `workload` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `year` YEAR NOT NULL,
    `category_id` INT,
    `return_count` INT DEFAULT 0,

    -- Foreign Key Constraint
    CONSTRAINT `fk_workload_category`
        FOREIGN KEY (`category_id`) REFERENCES `Categories`(`id`)
        ON DELETE CASCADE
);