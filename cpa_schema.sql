CREATE SCHEMA `cpa`;

-- CLIENT TABLE
CREATE TABLE cpa.`client` (
    client_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address VARCHAR(255) NOT NULL,
    UNIQUE (first_name, last_name, email)
);

-- SECTOR TABLE
CREATE TABLE cpa.`sector` (
    sector_id INT PRIMARY KEY AUTO_INCREMENT,
    sector_name VARCHAR(100) UNIQUE NOT NULL
);

-- TAX RETURN TABLE
CREATE TABLE cpa.`tax_return` (
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
CREATE TABLE cpa.`capacity` (
    capacity_id INT PRIMARY KEY AUTO_INCREMENT,
    year INT NOT NULL,
    max_num_returns INT NOT NULL,
    CONSTRAINT unique_year UNIQUE (year)
);

INSERT INTO capacity (year, max_num_returns) VALUES (2024, 150);

INSERT INTO cpa.client (first_name, last_name, email, address)
VALUES
('John', 'Doe', 'john.doe@example.com', '123 Main St, City A'),
('Jane', 'Doe', 'jane.doe@example.com', '123 Main St, City A'),
('Mike', 'Smith', 'mike.smith@example.com', '456 Oak St, City B'),
('Emily', 'Smith', 'emily.smith@example.com', '456 Oak St, City B'),
('Tom', 'Brown', 'tom.brown@example.com', '789 Pine St, City C'),
('Sarah', 'Brown', 'sarah.brown@example.com', '789 Pine St, City C'),
('Chris', 'Johnson', 'chris.johnson@example.com', '101 Maple St, City D'),
('Alex', 'Jones', 'alex.jones@example.com', '102 Maple St, City D'),
('Taylor', 'Davis', 'taylor.davis@example.com', '103 Maple St, City D'),
('Morgan', 'Lee', 'morgan.lee@example.com', '104 Maple St, City E'),
('Jordan', 'White', 'jordan.white@example.com', '105 Maple St, City F'),
('Jamie', 'Black', 'jamie.black@example.com', '106 Maple St, City F'),
('Sam', 'Green', 'sam.green@example.com', '107 Maple St, City G'),
('Kelly', 'Blue', 'kelly.blue@example.com', '108 Maple St, City H'),
('Pat', 'Yellow', 'pat.yellow@example.com', '109 Maple St, City I');

INSERT INTO cpa.sector (sector_name)
VALUES
('Technology'),
('Healthcare'),
('Retail'),
('Finance'),
('Military');

-- Single clients
INSERT INTO cpa.tax_return (client_id, spouse_id, sector_id, tax_year, filing_status, tax_liability, tax_paid)
VALUES
(1, NULL, 1, 2022, 'single', 5000.00, 4800.00),
(3, NULL, 3, 2023, 'single', 3500.00, 3400.00),
(5, NULL, 4, 2024, 'single', 4200.00, 4100.00),
(8, NULL, 5, 2022, 'single', 6000.00, 6000.00),
(9, NULL, 2, 2023, 'single', 3000.00, 2900.00);

-- Married clients filing jointly
INSERT INTO cpa.tax_return (client_id, spouse_id, sector_id, tax_year, filing_status, tax_liability, tax_paid)
VALUES
(1, 2, 1, 2023, 'married_joint', 9000.00, 8900.00),
(3, 4, 3, 2024, 'married_joint', 7500.00, 7400.00),
(5, 6, 4, 2022, 'married_joint', 12000.00, 11900.00);

-- Married clients filing separately
INSERT INTO cpa.tax_return (client_id, spouse_id, sector_id, tax_year, filing_status, tax_liability, tax_paid)
VALUES
(7, 8, 5, 2024, 'married_separate', 4500.00, 4400.00),
(8, 7, 5, 2024, 'married_separate', 4600.00, 4500.00),
(9, 10, 2, 2022, 'married_separate', 2800.00, 2700.00),
(10, 9, 2, 2022, 'married_separate', 2900.00, 2800.00);

-- Business clients
INSERT INTO cpa.tax_return (client_id, spouse_id, sector_id, tax_year, filing_status, tax_liability, tax_paid)
VALUES
(11, NULL, 3, 2022, 'business', 10000.00, 9800.00),
(12, NULL, 4, 2023, 'business', 8000.00, 7800.00),
(13, NULL, 5, 2024, 'business', 9500.00, 9300.00);
