CREATE TABLE business_account_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_account_id UUID NOT NULL REFERENCES business_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- e.g., 'owner', 'admin', 'member'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,

  UNIQUE (business_account_id, user_id)
);

CREATE INDEX idx_business_account_users_account ON business_account_users(business_account_id);
CREATE INDEX idx_business_account_users_user ON business_account_users(user_id);