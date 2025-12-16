const db = require('./pool');

let hasEnsuredTable = false;

const ensureTable = async () => {
  if (hasEnsuredTable || !db.isConnected()) return;
  const query = `
    CREATE TABLE IF NOT EXISTS address_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      address TEXT NOT NULL,
      destination JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  try {
    await db.query(query);
    hasEnsuredTable = true;
  } catch (error) {
    console.error('[history] Failed to ensure address_history table', error);
  }
};

const addHistoryEntry = async ({ address, destination }) => {
  if (!db.isConnected()) return null;
  await ensureTable();
  const query = `
    INSERT INTO address_history (address, destination)
    VALUES ($1, $2)
    RETURNING id, address, destination, created_at;
  `;
  const { rows } = await db.query(query, [address, destination]);
  console.log('[history] inserted entry', rows[0]);
  return rows[0];
};

const readHistoryRows = async (limit) => {
  const query = `
    SELECT id, address, destination, created_at
    FROM address_history
    ORDER BY created_at DESC
    LIMIT $1;
  `;
  const { rows } = await db.query(query, [limit]);
  return rows;
};

const pullFallbackFromTrips = async (limit) => {
  const query = `
    SELECT id, destination, created_at
    FROM trip_logs
    ORDER BY created_at DESC
    LIMIT $1;
  `;
  const { rows } = await db.query(query, [limit]);
  return rows.map((row) => ({
    id: row.id,
    address: row.destination?.placeName || 'Previous destination',
    destination: row.destination,
    created_at: row.created_at,
  }));
};

const listHistoryEntries = async (limit = 8) => {
  if (!db.isConnected()) return [];
  await ensureTable();
  const rows = await readHistoryRows(limit);
  if (rows.length > 0) {
    return rows;
  }
  const fallback = await pullFallbackFromTrips(limit);
  if (fallback.length > 0) {
    console.log('[history] seeding fallback entries from trip_logs');
  }
  return fallback;
};

const clearHistoryEntries = async () => {
  if (!db.isConnected()) return 0;
  await ensureTable();
  const result = await db.query('DELETE FROM address_history;');
  return result.rowCount;
};

module.exports = {
  addHistoryEntry,
  listHistoryEntries,
  clearHistoryEntries,
};
