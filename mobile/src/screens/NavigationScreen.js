import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
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

export const NavigationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const initialDestination = route.params?.initialDestination;
  const initialHandledRef = useRef(null);

  const [destinationAddress, setDestinationAddress] = useState('');
  const [lastSubmittedAddress, setLastSubmittedAddress] = useState('');
  const [inputError, setInputError] = useState(null);
  const [activeRouteTarget, setActiveRouteTarget] = useState(null);

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
  });

  const startNavigation = async (address) => {
    if (!origin) {
      setInputError('Waiting for your current location.');
      return;
    }
    const trimmed = address.trim();
    if (!trimmed) return;

    setInputError(null);
    setLastSubmittedAddress(trimmed);

    try {
      const destination = await geocodeMutation.mutateAsync(trimmed);
      setActiveRouteTarget({ destinationAddress: trimmed, destination });
      requestRoute({ origin, destinationAddress: trimmed, destination });
      refreshHistory();
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Unable to geocode destination.';
      setInputError(message);
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

  const clearDestination = () => {
    setDestinationAddress('');
    setLastSubmittedAddress('');
    setInputError(null);
    setActiveRouteTarget(null);
    initialHandledRef.current = null;
    reset();
  };

  const polylineCoordinates = useMemo(() => data?.polyline ?? [], [data]);

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
  errorText: {
    color: colors.danger,
  },
});

