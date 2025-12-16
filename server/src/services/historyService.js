const { addHistoryEntry, listHistoryEntries, clearHistoryEntries } = require('../db/addressHistory');

const recordAddressHistory = async ({ address, destination }) => {
  if (!address || !destination) return null;
  try {
    return await addHistoryEntry({ address, destination });
  } catch (error) {
    console.error('[history] Failed to store address history entry', error);
    return null;
  }
};

const getAddressHistory = async (limit) => {
  try {
    return await listHistoryEntries(limit);
  } catch (error) {
    console.error('[history] Failed to fetch address history', error);
    return [];
  }
};

const clearAddressHistory = async () => {
  try {
    return await clearHistoryEntries();
  } catch (error) {
    console.error('[history] Failed to clear address history', error);
    return 0;
  }
};

module.exports = {
  recordAddressHistory,
  getAddressHistory,
  clearAddressHistory,
};
