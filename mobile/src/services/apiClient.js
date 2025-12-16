import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const fallbackBaseUrl = Platform.select({
  android: 'http://10.0.2.2:4000',
  default: 'http://localhost:4000',
});

// Derive the LAN API host from the Expo dev server when no env var is set.
const deriveLanUrlFromExpoHost = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.manifest?.hostUri ??
    Constants.expoConfig?.extra?.hostUri;

  if (!hostUri) {
    return undefined;
  }

  try {
    const normalized = hostUri.includes('://') ? hostUri : `http://${hostUri}`;
    const { hostname } = new URL(normalized);
    if (!hostname || hostname === 'localhost') {
      return undefined;
    }
    return `http://${hostname}:4000`;
  } catch (_error) {
    return undefined;
  }
};

const baseURL =
  Constants.expoConfig?.extra?.apiUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  deriveLanUrlFromExpoHost() ||
  fallbackBaseUrl;

const requestSubscribers = new Set();

const notifyRequest = (payload) => {
  requestSubscribers.forEach((listener) => {
    try {
      listener(payload);
    } catch (error) {
      console.warn('[api] request listener failed:', error);
    }
  });
};

export const subscribeToApiRequests = (listener) => {
  requestSubscribers.add(listener);
  return () => requestSubscribers.delete(listener);
};

export const API_BASE_URL = baseURL;

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    const method = (config.method || 'get').toUpperCase();
    let resolvedUrl = config.url || '';
    try {
      resolvedUrl = config.baseURL
        ? new URL(config.url || '', config.baseURL).toString()
        : resolvedUrl;
    } catch (_error) {
      resolvedUrl = config.baseURL ? `${config.baseURL}${config.url || ''}` : resolvedUrl;
    }
    const details = { method, url: resolvedUrl, timestamp: new Date().toISOString() };
    console.log(`[api] ${method} ${resolvedUrl}`);
    notifyRequest(details);
    return config;
  },
  (error) => {
    console.warn('[api] Request config error:', error.message);
    return Promise.reject(error);
  },
);

export const createRoute = async ({ origin, destinationAddress, destination }) => {
  const { data } = await apiClient.post('/api/navigation/route', {
    origin,
    destinationAddress,
    destination,
  });
  return data;
};

export const geocodeDestination = async (address) => {
  const { data } = await apiClient.get('/api/navigation/geocode', {
    params: { address },
  });
  return data;
};

export const fetchAddressHistory = async ({ limit } = {}) => {
  const { data } = await apiClient.get('/api/navigation/history', {
    params: limit ? { limit } : undefined,
  });
  return data.history;
};

export const clearAddressHistory = async () => {
  const { data } = await apiClient.delete('/api/navigation/history');
  return data;
};

export const logDebugTrip = async () => {
  const { data } = await apiClient.post('/api/navigation/debug-log');
  return data;
};
