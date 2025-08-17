-- 006_create_crypto_integrations.sql

CREATE TABLE crypto_integrations (
    integration_id SERIAL PRIMARY KEY,
    partner_name VARCHAR(255) NOT NULL,
    api_endpoint VARCHAR(255) NOT NULL,
    api_key VARCHAR(255) NOT NULL, -- Consider encryption or secure storage in a real application
    supported_currencies TEXT -- Store as a comma-separated string or consider a separate table for currencies
);