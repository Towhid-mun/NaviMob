const db = require('./pool');

const saveTripLog = async ({ origin, destination, distance, duration }) => {
  if (!db.isConnected()) {
    console.warn('[db] Skipping trip log insert because the database is not connected.');
    return null;
  }

  const query = `
    INSERT INTO trip_logs (origin, destination, distance_meters, duration_seconds)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
  `;

  console.log('[db] Inserting trip log with distance', distance, 'and duration', duration);
  return db.query(query, [origin, destination, distance, duration]);
};

module.exports = { saveTripLog };
