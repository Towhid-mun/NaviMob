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
    <Dropdown
      data={suggestions}
      labelField="label"
      valueField="value"
      value={value}
      search
      renderInputSearch={() => (
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
      )}
      placeholder="Search destination"
      style={styles.dropdown}
      selectedTextStyle={styles.selectedText}
      placeholderStyle={styles.placeholder}
      containerStyle={styles.dropdownContainer}
      itemTextStyle={styles.dropdownItemText}
      onChange={(item) => onChangeText(item.value)}
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
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 12,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.background,
  },
  input: {
    color: colors.textPrimary,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  placeholder: {
    color: colors.textSecondary,
  },
  selectedText: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  dropdownContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  dropdownItemText: {
    color: colors.textPrimary,
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
