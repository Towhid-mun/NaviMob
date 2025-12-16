import React, { useEffect, useMemo, useRef } from 'react';
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

  const routeCoordinates = useMemo(() => {
    if (!coordinates?.length) return [];
    return coordinates.map(([longitude, latitude]) => ({ latitude, longitude }));
  }, [coordinates]);

  useEffect(() => {
    if (origin && mapRef.current) {
      mapRef.current.animateCamera({ center: origin, zoom: 13 }, { duration: 600 });
    }
  }, [origin]);

  useEffect(() => {
    if (routeCoordinates.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(routeCoordinates, {
        edgePadding: { top: 80, right: 40, bottom: 80, left: 40 },
        animated: true,
      });
    }
  }, [routeCoordinates]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={origin ? { ...origin, latitudeDelta: 0.05, longitudeDelta: 0.05 } : DEFAULT_REGION}
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


