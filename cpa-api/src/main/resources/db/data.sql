-- Insert into Capacity table
INSERT INTO capacity (year, max_num_returns) VALUES
(2022, 7),
(2023, 8),
(2024, 5);

-- Insert into Sector table
INSERT INTO sector (sector_name) VALUES
('corporate'),
('military'),
('education'),
('healthcare'),
('technology'),
('non-profit');

-- Insert into Client table
INSERT INTO client (first_name, last_name, email, address) VALUES
('John', 'Doe', 'john.doe@example.com', '123 Main St, Cityville'),
('Jane', 'Smith', 'jane.smith@example.com', '456 Maple Ave, Townsville'),
('James', 'Johnson', 'james.johnson@example.com', '789 Oak Dr, Villagetown'),
('Emily', 'Brown', 'emily.brown@example.com', '101 Pine Rd, Cityville'),
('Michael', 'Davis', 'michael.davis@example.com', '202 Elm St, Townsville'),
('Sarah', 'Miller', 'sarah.miller@example.com', '303 Cedar Ln, Villagetown'),
('David', 'Wilson', 'david.wilson@example.com', '404 Birch St, Cityville'),
('Anna', 'Moore', 'anna.moore@example.com', '505 Ash Ave, Townsville'),
('Christopher', 'Taylor', 'christopher.taylor@example.com', '606 Redwood Dr, Villagetown'),
('Jessica', 'Anderson', 'jessica.anderson@example.com', '707 Fir St, Cityville'),
('Robert', 'Thomas', 'robert.thomas@example.com', '808 Spruce Ave, Townsville'),
('Laura', 'Jackson', 'laura.jackson@example.com', '909 Poplar Rd, Villagetown'),
('Daniel', 'White', 'daniel.white@example.com', '1001 Walnut St, Cityville'),
('Olivia', 'Harris', 'olivia.harris@example.com', '1102 Magnolia Ln, Townsville'),
('Matthew', 'Martin', 'matthew.martin@example.com', '1203 Cherry Ave, Villagetown'),
('Sophia', 'Garcia', 'sophia.garcia@example.com', '1304 Plum Dr, Cityville'),
('Joshua', 'Martinez', 'joshua.martinez@example.com', '1405 Dogwood Rd, Townsville'),
('Emma', 'Rodriguez', 'emma.rodriguez@example.com', '1506 Cypress St, Villagetown'),
('Anthony', 'Clark', 'anthony.clark@example.com', '1607 Willow Ln, Cityville'),
('Mia', 'Lewis', 'mia.lewis@example.com', '1708 Hemlock Rd, Townsville');

-- Insert into Tax Return table
INSERT INTO tax_return (client_id, spouse_id, sector_id, tax_year, filing_status, tax_liability, tax_paid) VALUES
(1, NULL, 1, 2022, 'single', 12000.00, 11000.00),
(2, 1, 1, 2022, 'married_joint', 24000.00, 25000.00),
(3, NULL, 2, 2023, 'single', 10000.00, 10000.00),
(4, NULL, 3, 2023, 'single', 9000.00, 9500.00),
(5, NULL, 4, 2024, 'single', 15000.00, 14000.00),
(6, 5, 4, 2024, 'married_joint', 30000.00, 29000.00),
(7, NULL, 5, 2022, 'single', 13000.00, 13000.00),
(8, NULL, 6, 2023, 'single', 11000.00, 10000.00),
(9, 10, 5, 2023, 'married_separate', 20000.00, 21000.00),
(10, 9, 5, 2023, 'married_separate', 18000.00, 17000.00);
