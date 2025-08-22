-- backend/migrations/007_create_virtual_cards_and_transactions.sql

-- Create the virtual_cards table
CREATE TABLE virtual_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Foreign key referencing the users table
    marqeta_card_token VARCHAR(255) UNIQUE NOT NULL, -- Unique token from Marqeta
    status VARCHAR(50) NOT NULL DEFAULT 'inactive', -- e.g., 'active', 'suspended', 'terminated'
    balance DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    -- Add other relevant columns for virtual card details (e.g., card_program_token, funding_source_token)
    -- Add foreign key constraints
    -- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create an index on user_id for faster lookups
CREATE INDEX idx_virtual_cards_user_id ON virtual_cards(user_id);

-- Create the transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    virtual_card_id UUID NOT NULL, -- Foreign key referencing the virtual_cards table
    marqeta_transaction_token VARCHAR(255) UNIQUE, -- Unique token from Marqeta (can be null initially)
    type VARCHAR(50) NOT NULL, -- e.g., 'purchase', 'withdrawal', 'topup', 'fee', 'refund'
    amount DECIMAL(18, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    state VARCHAR(50) NOT NULL, -- e.g., 'PENDING', 'COMPLETION', 'DECLINED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE, -- Timestamp for completion or decline
    fees DECIMAL(18, 2) DEFAULT 0.00, -- Fees associated with the transaction
    revenue DECIMAL(18, 2) DEFAULT 0.00, -- Revenue generated from the transaction
    merchant_details JSONB, -- Store merchant information as JSON
    -- Add other relevant columns for transaction details
    -- Add foreign key constraints
    -- FOREIGN KEY (virtual_card_id) REFERENCES virtual_cards(id) ON DELETE CASCADE
);

-- Create indexes for faster lookups
CREATE INDEX idx_transactions_virtual_card_id ON transactions(virtual_card_id);
CREATE INDEX idx_transactions_marqeta_transaction_token ON transactions(marqeta_transaction_token);