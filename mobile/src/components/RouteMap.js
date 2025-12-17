import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { colors } from '../theme/colors';

const DEFAULT_REGION = {
  latitude: 43.6532,
  longitude: -79.3832,
  latitudeDelta: 0.25,
  longitudeDelta: 0.25,
};

export const RouteMap = ({ origin, destination, coordinates }) => {
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  const routeCoordinates = useMemo(() => {
    if (!coordinates?.length) return [];
    return coordinates.map(([longitude, latitude]) => ({ latitude, longitude }));
  }, [coordinates]);

  const focusCoordinates = useMemo(() => {
    if (routeCoordinates.length > 1) {
      return routeCoordinates;
    }
    const focus = [];
    if (origin) focus.push(origin);
    if (destination?.coords) focus.push(destination.coords);
    return focus;
  }, [routeCoordinates, origin, destination]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || focusCoordinates.length === 0) return;

    if (focusCoordinates.length === 1) {
      mapRef.current.animateCamera(
        { center: focusCoordinates[0], zoom: 15 },
        { duration: 600 },
      );
      return;
    }

    mapRef.current.fitToCoordinates(focusCoordinates, {
      edgePadding: { top: 120, right: 60, bottom: 120, left: 60 },
      animated: true,
    });
  }, [mapReady, focusCoordinates]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={
          origin ? { ...origin, latitudeDelta: 0.05, longitudeDelta: 0.05 } : DEFAULT_REGION
        }
        onMapReady={() => setMapReady(true)}
        customMapStyle={mapStyle}
      >
        {origin && (
          <Marker coordinate={origin} title="You" description="Current position" />
        )}
        {destination?.coords && (
          <Marker
            coordinate={destination.coords}
            title={destination.placeName || 'Destination'}
            pinColor={colors.accent}
          />
        )}
        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={5}
            strokeColor={colors.accent}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 600,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
});

const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#f5f7fb' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4a4f63' }] },
  { featureType: 'water', stylers: [{ color: '#dbe9ff' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eef1f6' }] },
];
