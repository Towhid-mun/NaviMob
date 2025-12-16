const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const PORT = process.env.PORT || 4000;
const MAPS_API_KEY = process.env.MAPS_API_KEY || '';
const DATABASE_URL = process.env.DATABASE_URL || '';

module.exports = {
  PORT,
  MAPS_API_KEY,
  DATABASE_URL,
};
