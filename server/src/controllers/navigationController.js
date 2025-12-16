const { z } = require('zod');
const { geocodeAddress, fetchRoute } = require('../services/mapsService');
const { saveTripLog } = require('../db/tripLogs');
const {
  recordAddressHistory,
  getAddressHistory,
  clearAddressHistory,
} = require('../services/historyService');

const routeRequestSchema = z
  .object({
    origin: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
    destinationAddress: z.string().min(3).optional(),
    destination: z
      .object({
        placeName: z.string(),
        coords: z.object({
          latitude: z.number(),
          longitude: z.number(),
        }),
      })
      .optional(),
  })
  .refine((val) => Boolean(val.destinationAddress || val.destination), {
    message: 'destinationAddress or destination is required',
    path: ['destination'],
  });

const geocodeQuerySchema = z.object({
  address: z.string().min(3),
});

const historyQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(25).optional(),
});

const createRoute = async (req, res, next) => {
  try {
    const payload = routeRequestSchema.parse(req.body);
    const inputAddress = payload.destinationAddress || payload.destination?.placeName || '';

    let destination = payload.destination;
    if (!destination) {
      destination = await geocodeAddress(payload.destinationAddress);
    }

    const route = await fetchRoute(payload.origin, destination.coords);
    const eta = new Date(Date.now() + route.duration * 1000).toISOString();

    await saveTripLog({
      origin: payload.origin,
      destination,
      distance: Math.round(route.distance),
      duration: Math.round(route.duration),
    });

    await recordAddressHistory({ address: inputAddress || destination.placeName, destination });

    return res.json({
      destination,
      distance: route.distance,
      duration: route.duration,
      eta,
      polyline: route.polyline,
    });
  } catch (error) {
    next(error);
  }
};

const geocodeDestination = async (req, res, next) => {
  try {
    const { address } = geocodeQuerySchema.parse(req.query);
    const destination = await geocodeAddress(address);
    res.json(destination);
  } catch (error) {
    next(error);
  }
};

const listAddressHistory = async (req, res, next) => {
  try {
    const { limit } = historyQuerySchema.parse(req.query);
    const entries = await getAddressHistory(limit);
    console.log('[history] Returning entries:', entries);
    res.json({ history: entries });
  } catch (error) {
    next(error);
  }
};

const clearAddressHistoryHandler = async (_req, res, next) => {
  try {
    const removed = await clearAddressHistory();
    res.json({ cleared: removed });
  } catch (error) {
    next(error);
  }
};

const logDebugTrip = async (_req, res, next) => {
  try {
    const fallbackTrip = {
      origin: { latitude: 43.6532, longitude: -79.3832 },
      destination: {
        placeName: 'Debug Destination',
        coords: { latitude: 43.7001, longitude: -79.4163 },
      },
      distance: 12000,
      duration: 900,
    };

    await saveTripLog(fallbackTrip);

    res.status(201).json({ message: 'Debug trip inserted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoute,
  geocodeDestination,
  listAddressHistory,
  clearAddressHistoryHandler,
  logDebugTrip,
};
