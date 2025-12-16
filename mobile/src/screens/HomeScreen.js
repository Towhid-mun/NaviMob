import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { DestinationSearch } from '../components/DestinationSearch';
import { PermissionBanner } from '../components/PermissionBanner';
import { RouteMap } from '../components/RouteMap';
import { useLocationTracking } from '../hooks/useLocationTracking';
import { useAddressHistory } from '../hooks/useAddressHistory';
import { colors } from '../theme/colors';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const {
    origin,
    permissionStatus,
    requestPermission,
    openSettings,
    error,
  } = useLocationTracking();
  const { history, refreshHistory } = useAddressHistory();
  const [destinationAddress, setDestinationAddress] = useState('');
  const [inputError, setInputError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshHistory();
    }, [refreshHistory]),
  );

  const handleNavigate = () => {
    if (!origin) {
      setInputError('Fetching your location...');
      return;
    }
    const trimmed = destinationAddress.trim();
    if (!trimmed) return;
    setIsSubmitting(true);
    setInputError(null);
    navigation.navigate('Navigation', { initialDestination: trimmed });
    setIsSubmitting(false);
  };

  const filteredSuggestions = useMemo(() => {
    const filtered = (history || [])
      .filter((entry) => {
        if (!destinationAddress.trim()) return true;
        const label = (entry.address || entry.destination?.placeName || '').toLowerCase();
        return label.includes(destinationAddress.trim().toLowerCase());
      })
      .slice(0, 5);
    console.debug('[history] suggestions for input', destinationAddress, filtered);
    return filtered;
  }, [history, destinationAddress]);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Where are we headed?</Text>
          <Text style={styles.subtitle}>Enter a destination to start navigation.</Text>
        </View>

        {permissionStatus !== 'granted' && (
          <PermissionBanner
            status={permissionStatus}
            onRequest={requestPermission}
            onOpenSettings={openSettings}
          />
        )}

        <View style={styles.mapCard}>
          <RouteMap origin={origin} destination={null} coordinates={[]} />
          {error ? <Text style={styles.mapError}>{error}</Text> : null}
        </View>

        <DestinationSearch
          value={destinationAddress}
          onChangeText={setDestinationAddress}
          onSubmit={handleNavigate}
          isSubmitting={isSubmitting}
          errorMessage={inputError}
          suggestions={filteredSuggestions}
          onSelectSuggestion={(entry) =>
            setDestinationAddress(entry.address || entry.destination?.placeName || '')
          }
        />
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
  header: {
    marginBottom: 8,
    gap: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    color: colors.textSecondary,
  },
  mapCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    height: 400,
  },
  mapError: {
    color: colors.danger,
    padding: 12,
  },
});

