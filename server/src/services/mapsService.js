const axios = require('axios');
const { MAPS_API_KEY } = require('../utils/config');
const { HttpError } = require('../utils/errors');

const MAPBOX_BASE = 'https://api.mapbox.com';

const isPlaceholderKey = (key) =>
  !key || /your_mapbox/i.test(key) || key.trim().length < 35;

const assertApiKey = () => {
  if (isPlaceholderKey(MAPS_API_KEY)) {
    throw new HttpError(
      500,
      'MAPS_API_KEY is missing or invalid. Update .env with a valid Mapbox access token (pk...).',
    );
  }
};

const geocodeAddress = async (address) => {
  assertApiKey();
  const url = `${MAPBOX_BASE}/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`;
  const { data } = await axios.get(url, {
    params: {
      access_token: MAPS_API_KEY,
      limit: 1,
    },
  });
  const feature = data.features?.[0];
  if (!feature) {
    throw new HttpError(404, 'Unable to geocode destination.');
  }
  return {
    placeName: feature.place_name,
    coords: { longitude: feature.center[0], latitude: feature.center[1] },
  };
};

const fetchRoute = async (origin, destination) => {
  assertApiKey();
  const coordinates = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
  const url = `${MAPBOX_BASE}/directions/v5/mapbox/driving/${coordinates}`;
  const { data } = await axios.get(url, {
    params: {
      access_token: MAPS_API_KEY,
      geometries: 'geojson',
      overview: 'full',
    },
  });
  const route = data.routes?.[0];
  if (!route) {
    throw new HttpError(502, 'No route returned from mapping provider.');
  }
  return {
    distance: route.distance,
    duration: route.duration,
    polyline: route.geometry.coordinates,
  };
};

module.exports = { geocodeAddress, fetchRoute };
