import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../theme/colors';

export const DestinationSearch = ({
  value,
  onChangeText,
  onSubmit,
  isSubmitting,
  errorMessage,
  suggestions = [],
  onSelectSuggestion,
}) => (
  <View style={styles.container}>
    <TextInput
      style={styles.input}
      placeholder="Enter destination"
      placeholderTextColor={colors.textSecondary}
      value={value}
      onChangeText={onChangeText}
      autoCorrect={false}
      autoCapitalize="words"
      returnKeyType="search"
      onSubmitEditing={onSubmit}
    />
    <Pressable
      accessibilityRole="button"
      disabled={!value?.trim() || isSubmitting}
      onPress={onSubmit}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        (!value?.trim() || isSubmitting) && styles.buttonDisabled,
      ]}
    >
      {isSubmitting ? (
        <ActivityIndicator color={colors.background} />
      ) : (
        <Text style={styles.buttonText}>Navigate To</Text>
      )}
    </Pressable>
    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    {suggestions.length > 0 && (
      <View style={styles.suggestions}>
        {suggestions.map((suggestion) => (
          <Pressable
            key={suggestion.id}
            style={({ pressed }) => [styles.suggestionRow, pressed && styles.suggestionRowPressed]}
            onPress={() => onSelectSuggestion?.(suggestion)}
          >
            <Text style={styles.suggestionText}>
              {suggestion.address || suggestion.destination?.placeName}
            </Text>
          </Pressable>
        ))}
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    paddingVertical: 8,
  },
  button: {
    backgroundColor: colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: colors.background,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
  },
  suggestions: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  suggestionRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
  },
  suggestionRowPressed: {
    backgroundColor: colors.surface,
  },
  suggestionText: {
    color: colors.textPrimary,
  },
});
