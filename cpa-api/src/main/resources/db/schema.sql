-- CLIENT TABLE
CREATE TABLE client (
    client_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address VARCHAR(255) NOT NULL,
    UNIQUE (first_name, last_name, email)
);

-- SECTOR TABLE
CREATE TABLE sector (
    sector_id INT PRIMARY KEY AUTO_INCREMENT,
    sector_name VARCHAR(100) UNIQUE NOT NULL
);

-- TAX RETURN TABLE
CREATE TABLE tax_return (
    tax_return_id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    spouse_id INT DEFAULT NULL,
    sector_id INT NOT NULL,
    tax_year INT NOT NULL,
    filing_status ENUM('single', 'married_joint', 'married_separate', 'business') NOT NULL,
    tax_liability DECIMAL(10, 2) NOT NULL,
    tax_paid DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES client(client_id) ON DELETE CASCADE,
    CONSTRAINT fk_spouse_tax FOREIGN KEY (spouse_id) REFERENCES client(client_id) ON DELETE SET NULL,
    CONSTRAINT fk_sector FOREIGN KEY (sector_id) REFERENCES sector(sector_id),
    CONSTRAINT unique_tax_return_per_year UNIQUE (client_id, tax_year),
    CONSTRAINT unique_joint_filing UNIQUE (client_id, spouse_id, tax_year),
    CONSTRAINT unique_person_in_tax_return UNIQUE (tax_year, client_id, spouse_id)
);

-- CAPACITY TABLE
CREATE TABLE capacity (
    capacity_id INT PRIMARY KEY AUTO_INCREMENT,
    year INT NOT NULL,
    max_num_returns INT NOT NULL,
    CONSTRAINT unique_year UNIQUE (year)
);
