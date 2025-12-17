import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '../theme/colors';

export const DestinationSearch = ({
  value,
  onChangeText,
  onSubmit,
  isSubmitting,
  errorMessage,
  suggestions = [],
}) => (
  <View style={styles.container}>
    <View style={styles.inputWrapper}>
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
    </View>

    {suggestions.length > 0 && (
      <Dropdown
        data={suggestions}
        labelField="label"
        valueField="value"
        placeholder="Recent destinations"
        value={null}
        style={styles.dropdown}
        placeholderStyle={styles.dropdownPlaceholder}
        selectedTextStyle={styles.dropdownSelected}
        itemTextStyle={styles.dropdownItem}
        containerStyle={styles.dropdownContainer}
        maxHeight={200}
        onChange={(item) => onChangeText(item.value)}
      />
    )}

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
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 10,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: {
    color: colors.textPrimary,
    fontSize: 16,
    paddingVertical: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
  },
  dropdownPlaceholder: {
    color: colors.textSecondary,
  },
  dropdownSelected: {
    color: colors.textPrimary,
    fontSize: 15,
  },
  dropdownItem: {
    color: colors.textPrimary,
    paddingVertical: 10,
  },
  dropdownContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
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
});
