import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { formatDistance, formatDistanceImperial, formatDuration, formatEta } from '../utils/formatters';

export const RouteMetricsCard = ({ distance, duration, eta, isFetching }) => (
  <View style={styles.container}>
    {isFetching ? (
      <View style={styles.loadingRow}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.loadingText}>Calculating route.</Text>
      </View>
    ) : (
      <View style={styles.metricsRow}>
        <Metric
          label="Distance Remaining"
          value={formatDistance(distance)}
          helper={formatDistanceImperial(distance)}
        />
        <Metric label="Duration" value={formatDuration(duration)} />
        <Metric label="ETA" value={formatEta(eta)} />
      </View>
    )}
  </View>
);

const Metric = ({ label, value, helper }) => (
  <View style={styles.metric}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value}</Text>
    {helper ? <Text style={styles.metricHelper}>{helper}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  metricValue: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  metricHelper: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: colors.textSecondary,
  },
});
