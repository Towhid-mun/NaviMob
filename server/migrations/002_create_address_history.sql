CREATE TABLE IF NOT EXISTS address_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT NOT NULL,
  destination JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
