import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteMap } from '../components/RouteMap';
import { RouteMetricsCard } from '../components/RouteMetricsCard';
import { AddressHistoryList } from '../components/AddressHistoryList';
import { useLocationTracking } from '../hooks/useLocationTracking';
import { useRouteUpdates } from '../hooks/useRouteUpdates';
import { useAddressHistory } from '../hooks/useAddressHistory';
import { colors } from '../theme/colors';
import { useMutation } from '@tanstack/react-query';
import { geocodeDestination } from '../services/apiClient';

const TRIP_COMPLETION_DISTANCE_METERS = 30;

export const NavigationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const initialDestination = route.params?.initialDestination;
  const initialHandledRef = useRef(null);

  const [destinationAddress, setDestinationAddress] = useState('');
  const [lastSubmittedAddress, setLastSubmittedAddress] = useState('');
  const [inputError, setInputError] = useState(null);
  const [activeRouteTarget, setActiveRouteTarget] = useState(null);
  const [tripStatus, setTripStatus] = useState('idle');

  const {
    origin,
    permissionStatus,
    requestPermission,
    openSettings,
    error: locationError,
  } = useLocationTracking();

  const {
    history,
    isLoadingHistory,
    clearHistory,
    isClearingHistory,
    refreshHistory,
  } = useAddressHistory();

  const geocodeMutation = useMutation({ mutationFn: geocodeDestination });

  const handleRouteError = (error) => {
    const message = error?.response?.data?.message || error.message || 'Unable to calculate route.';
    setInputError(message);
    if (error?.response?.data?.code === 'InvalidInput') {
      Alert.alert('Invalid destination', message, [{ text: 'OK', onPress: () => navigation.goBack() }]);
    }
  };

  const {
    requestRoute,
    isFetching,
    data,
    error: routeError,
    reset,
  } = useRouteUpdates({
    onSuccess: (response) => {
      if (response?.destination) {
        setActiveRouteTarget({
          destinationAddress: lastSubmittedAddress || response.destination.placeName,
          destination: response.destination,
        });
      }
      refreshHistory();
    },
    onError: handleRouteError,
  });

  const completeTrip = (message) => {
    setTripStatus('completed');
    Alert.alert('Trip completed', message, [{ text: 'OK' }]);
  };

  const handleStartTrip = () => setTripStatus('active');

  const handleStopTrip = () => completeTrip('Trip stopped.');

  const startNavigation = async (address) => {
    if (!origin) {
      setInputError('Waiting for your current location.');
      return;
    }
    const trimmed = address.trim();
    if (!trimmed) return;

    setInputError(null);
    setLastSubmittedAddress(trimmed);
    setTripStatus('idle');

    try {
      const destination = await geocodeMutation.mutateAsync(trimmed);
      setActiveRouteTarget({ destinationAddress: trimmed, destination });
      requestRoute({ origin, destinationAddress: trimmed, destination });
      refreshHistory();
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Unable to geocode destination.';
      setInputError(message);
      if (error?.response?.data?.code === 'InvalidInput') {
        Alert.alert('Invalid destination', message, [{ text: 'OK', onPress: () => navigation.goBack() }]);
      }
    }
  };

  useEffect(() => {
    if (initialDestination && origin && initialHandledRef.current !== initialDestination) {
      setDestinationAddress(initialDestination);
      initialHandledRef.current = initialDestination;
      startNavigation(initialDestination);
    }
  }, [initialDestination, origin]);

  useEffect(() => {
    if (!origin || !activeRouteTarget) return;
    const intervalId = setInterval(() => {
      if (isFetching) return;
      requestRoute({
        origin,
        destinationAddress: activeRouteTarget.destinationAddress,
        destination: activeRouteTarget.destination,
      });
    }, 15000);

    return () => clearInterval(intervalId);
  }, [origin, activeRouteTarget, requestRoute, isFetching]);

  useEffect(() => {
    if (tripStatus !== 'active') return;
    const distance = data?.distance;
    if (typeof distance === 'number' && distance <= TRIP_COMPLETION_DISTANCE_METERS) {
      completeTrip('You arrived at your destination.');
    }
  }, [tripStatus, data]);

  const clearDestination = () => {
    setDestinationAddress('');
    setLastSubmittedAddress('');
    setInputError(null);
    setActiveRouteTarget(null);
    initialHandledRef.current = null;
    setTripStatus('idle');
    reset();
  };

  const polylineCoordinates = useMemo(() => data?.polyline ?? [], [data]);

  const showTripButton = Boolean(data?.distance) && tripStatus !== 'completed';
  const tripButtonLabel = tripStatus === 'active' ? 'Stop Trip' : 'Start Trip';
  const onTripButtonPress = tripStatus === 'active' ? handleStopTrip : handleStartTrip;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.navigationBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <View>
            <Text style={styles.title}>Navigation</Text>
            {lastSubmittedAddress ? (
              <Text style={styles.subtitle}>{lastSubmittedAddress}</Text>
            ) : null}
          </View>
        </View>

        {permissionStatus !== 'granted' && (
          <Text style={styles.errorText}>Location permission required.</Text>
        )}

        <View style={styles.mapWrapper}>
          <RouteMap
            origin={origin}
            destination={data?.destination}
            coordinates={polylineCoordinates}
          />
        </View>

        {showTripButton && (
          <Pressable
            onPress={onTripButtonPress}
            style={({ pressed }) => [
              styles.tripButton,
              pressed && styles.tripButtonPressed,
            ]}
          >
            <Text style={styles.tripButtonText}>{tripButtonLabel}</Text>
          </Pressable>
        )}

        <RouteMetricsCard
          distance={data?.distance}
          duration={data?.duration}
          eta={data?.eta}
          isFetching={isFetching}
        />

        <AddressHistoryList
          items={history}
          isLoading={isLoadingHistory}
          isClearing={isClearingHistory}
          onSelect={(entry) =>
            setDestinationAddress(entry.address || entry.destination?.placeName || '')
          }
          onClear={() => clearHistory()}
        />

        {(routeError || locationError || inputError) && (
          <Text style={styles.errorText}>
            {routeError?.message || locationError || inputError}
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'right',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'right',
  },
  mapWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    height: 500,
  },
  tripButton: {
    marginTop: 12,
    alignSelf: 'center',
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  tripButtonPressed: {
    opacity: 0.85,
  },
  tripButtonText: {
    color: colors.background,
    fontWeight: '700',
    fontSize: 16,
  },
  errorText: {
    color: colors.danger,
  },
});
