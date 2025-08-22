-- Create virtual_cards table
CREATE TABLE virtual_cards (
    id INT PRIMARY KEY,
    user_id INT,
    card_number VARCHAR(16),
    expiration_date VARCHAR(5),
    cvv VARCHAR(3),
    status VARCHAR(20),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Create transactions table
CREATE TABLE transactions (
    id INT PRIMARY KEY,
    virtual_card_id INT,
    amount DECIMAL(10, 2),
    currency VARCHAR(3),
    merchant VARCHAR(255),
    transaction_date TIMESTAMP,
    status VARCHAR(20),
    created_at TIMESTAMP
);