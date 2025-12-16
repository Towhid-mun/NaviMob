const { Router } = require('express');
const {
  createRoute,
  logDebugTrip,
  geocodeDestination,
  listAddressHistory,
  clearAddressHistoryHandler,
} = require('../controllers/navigationController');

const router = Router();

router.post('/route', createRoute);
router.get('/geocode', geocodeDestination);
router.get('/history', listAddressHistory);
router.delete('/history', clearAddressHistoryHandler);
router.post('/debug-log', logDebugTrip);

module.exports = router;
