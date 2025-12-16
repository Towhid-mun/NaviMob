import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { Linking } from 'react-native';

export const useLocationTracking = () => {
  const [permissionStatus, setPermissionStatus] = useState('checking');
  const [origin, setOrigin] = useState(null);
  const [error, setError] = useState(null);
  const watchSubscription = useRef(null);

  const ensurePermission = useCallback(async () => {
    setPermissionStatus('checking');
    const current = await Location.getForegroundPermissionsAsync();
    if (current.status === Location.PermissionStatus.GRANTED) {
      setPermissionStatus('granted');
      return true;
    }
    if (current.status === Location.PermissionStatus.DENIED && !current.canAskAgain) {
      setPermissionStatus('blocked');
      return false;
    }
    const requestResult = await Location.requestForegroundPermissionsAsync();
    if (requestResult.status === Location.PermissionStatus.GRANTED) {
      setPermissionStatus('granted');
      return true;
    }
    setPermissionStatus(requestResult.status);
    return false;
  }, []);

  const startTracking = useCallback(async () => {
    if (watchSubscription.current || permissionStatus !== 'granted') return;
    watchSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 15,
        timeInterval: 5000,
      },
      (position) => {
        setOrigin({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
      },
    );
  }, [permissionStatus]);

  const stopTracking = useCallback(() => {
    if (watchSubscription.current) {
      watchSubscription.current.remove();
      watchSubscription.current = null;
    }
  }, []);

  useEffect(() => {
    ensurePermission();
    return () => stopTracking();
  }, [ensurePermission, stopTracking]);

  useEffect(() => {
    if (permissionStatus === 'granted') {
      startTracking();
    } else {
      stopTracking();
    }
  }, [permissionStatus, startTracking, stopTracking]);

  const promptToOpenSettings = useCallback(() => {
    Linking.openSettings().catch(() => {});
  }, []);

  const refreshLocation = useCallback(async () => {
    if (permissionStatus !== 'granted') {
      const granted = await ensurePermission();
      if (!granted) return null;
    }
    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        maximumAge: 5000,
      });
      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setOrigin(coords);
      return coords;
    } catch (geoError) {
      setError(geoError.message);
      return null;
    }
  }, [ensurePermission, permissionStatus]);

  return {
    origin,
    permissionStatus,
    error,
    requestPermission: ensurePermission,
    refreshLocation,
    openSettings: promptToOpenSettings,
  };
};
