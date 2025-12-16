CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS trip_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin JSONB NOT NULL,
  destination JSONB NOT NULL,
  distance_meters INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
