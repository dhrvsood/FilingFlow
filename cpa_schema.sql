CREATE SCHEMA `cpa`;

-- CLIENT TABLE
CREATE TABLE `client` (
    client_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address VARCHAR(255) NOT NULL,
    UNIQUE (first_name, last_name, email)
);

-- SECTOR TABLE
CREATE TABLE `sector` (
    sector_id INT PRIMARY KEY AUTO_INCREMENT,
    sector_name VARCHAR(100) UNIQUE NOT NULL
);

-- TAX RETURN TABLE
CREATE TABLE `tax_return` (
    tax_return_id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    spouse_id INT DEFAULT NULL,  -- Spouse reference only if filing jointly
    sector_id INT NOT NULL,
    tax_year INT NOT NULL,
    filing_status ENUM('single', 'married_joint', 'married_separate', 'business') NOT NULL,
    tax_liability DECIMAL(10, 2) NOT NULL,
    tax_paid DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES Client(client_id) ON DELETE CASCADE,
    CONSTRAINT fk_spouse_tax FOREIGN KEY (spouse_id) REFERENCES Client(client_id) ON DELETE SET NULL,
    CONSTRAINT fk_sector FOREIGN KEY (sector_id) REFERENCES Sector(sector_id),
    CONSTRAINT unique_tax_return_per_year UNIQUE (client_id, tax_year),  -- Ensure one return per client per year
    CONSTRAINT unique_joint_filing UNIQUE (client_id, spouse_id, tax_year)  -- Ensure only one joint return per couple
);

-- CAPACITY TABLE
CREATE TABLE `capacity` (
    capacity_id INT PRIMARY KEY AUTO_INCREMENT,
    year INT NOT NULL,
    max_num_returns INT NOT NULL,
    CONSTRAINT unique_year UNIQUE (year)
);

INSERT INTO capacity (year, max_num_returns) VALUES (2024, 150);

-- INSERT INTO client (first_name, last_name, email, address) VALUES
-- ('John', 'Doe', 'john.doe@example.com', '123 Elm St, Springfield, IL'),
-- ('Jane', 'Doe', 'jane.doe@example.com', '123 Elm St, Springfield, IL'),
-- ('Mike', 'Smith', 'mike.smith@example.com', '456 Oak St, Springfield, IL'),
-- ('Samantha', 'Johnson', 'sam.johnson@example.com', '789 Pine St, Springfield, IL');

-- Select * from client;

-- INSERT INTO Sector (sector_name) VALUES
-- ('Retail'),
-- ('Technology'),
-- ('Healthcare'),
-- ('Finance');

-- select * from sector;

-- -- Joint filing (John and Jane Doe)
-- INSERT INTO tax_return (client_id, spouse_id, sector_id, tax_year, filing_status, taxLiability, taxPaid) VALUES
-- (1, 2, 1, 2024, 'married_joint', 30000.00, 25000.00);

-- -- Separate filings (Mike Smith and Samantha Johnson)
-- INSERT INTO tax_return (client_id, spouse_id, sector_id, tax_year, filing_status, taxLiability, taxPaid) VALUES
-- (3, NULL, 2, 2024, 'married_separate', 15000.00, 14000.00),
-- (4, NULL, 3, 2024, 'married_separate', 18000.00, 16000.00);

-- -- Single filing (John Doe filing separately for a different year, before marriage)
-- INSERT INTO tax_return (client_id, spouse_id, sector_id, tax_year, filing_status, taxLiability, taxPaid) VALUES
-- (1, NULL, 4, 2023, 'single', 10000.00, 9000.00);

-- select * from tax_return where filing_status = 'single';

-- SELECT 
--     c.first_name AS client_first_name,
--     c.last_name AS client_last_name,
--     s.first_name AS spouse_first_name,
--     s.last_name AS spouse_last_name,
--     sec.sector_name,
--     tr.tax_year,
--     tr.filing_status,
--     tr.taxLiability,
--     tr.taxPaid
-- FROM 
--     tax_return tr
-- JOIN 
--     Client c ON tr.client_id = c.client_id
-- LEFT JOIN 
--     Client s ON tr.spouse_id = s.client_id  -- Left join to handle cases where spouse_id is NULL
-- JOIN 
--     Sector sec ON tr.sector_id = sec.sector_id;


