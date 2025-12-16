import React from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export const AddressHistoryList = ({
  items,
  onSelect,
  onClear,
  isLoading,
  isClearing,
}) => (
  <View style={styles.container}>
    <View style={styles.headerRow}>
      <Text style={styles.title}>Recent Addresses</Text>
      <Pressable
        onPress={onClear}
        disabled={isClearing || !items.length}
        style={({ pressed }) => [
          styles.clearButton,
          (pressed || isClearing) && styles.clearButtonPressed,
          !items.length && styles.clearButtonDisabled,
        ]}
      >
        {isClearing ? (
          <ActivityIndicator color={colors.accent} size="small" />
        ) : (
          <Text style={styles.clearButtonText}>Clear</Text>
        )}
      </Pressable>
    </View>
    {isLoading ? (
      <View style={styles.loadingRow}>
        <ActivityIndicator color={colors.accent} size="small" />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    ) : (
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No addresses yet.</Text>}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onSelect?.(item)}
            style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
          >
            <Text numberOfLines={1} style={styles.pillText}>
              {item.address || item.destination?.placeName}
            </Text>
          </Pressable>
        )}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearButtonText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  clearButtonDisabled: {
    opacity: 0.4,
  },
  clearButtonPressed: {
    opacity: 0.7,
  },
  listContent: {
    paddingVertical: 4,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    maxWidth: 200,
  },
  pillPressed: {
    opacity: 0.8,
  },
  pillText: {
    color: colors.textPrimary,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: colors.textSecondary,
  },
  emptyText: {
    color: colors.textSecondary,
  },
});
