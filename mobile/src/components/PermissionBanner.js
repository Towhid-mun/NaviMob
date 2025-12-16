import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export const PermissionBanner = ({ status, onRequest, onOpenSettings }) => {
  const isBlocked = status === 'blocked';
  const ctaLabel = isBlocked ? 'Open settings' : 'Enable location';

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Location access needed</Text>
        <Text style={styles.subtitle}>
          Grant precise location to calculate routes, ETAs, and trip logs.
        </Text>
      </View>
      <Pressable
        onPress={isBlocked ? onOpenSettings : onRequest}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>{ctaLabel}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  textContainer: {
    marginBottom: 12,
  },
  title: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 18,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    color: colors.background,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
