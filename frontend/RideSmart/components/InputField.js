import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FontFamily, FontSize, Color, Gap, Border } from '../GlobalStyles';

const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  rightIcon = null,
  leftIcon = null,         // Added leftIcon prop
  containerStyle = {},
  onFocus,
  ...otherProps
}) => {
  return (
    <View style={[styles.inputFieldContainer, containerStyle]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        <TextInput
          style={[
            styles.inputField,
            leftIcon ? { paddingLeft: 40 } : {},      // Add padding if left icon exists
            rightIcon ? { paddingRight: 40 } : {},    // Add padding if right icon exists
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={onFocus}
          {...otherProps}
        />
        {rightIcon && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputFieldContainer: {
    marginBottom: Gap.gap_md,
  },
  inputLabel: {
    fontSize: FontSize.size_lg,
    fontWeight: '700',
    color: Color.casal950,
    marginBottom: Gap.gap_xs,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center'
  },
  inputField: {
    borderWidth: 1,
    borderColor: Color.colorDarkgray_200,
    borderRadius: Border.br_8xs,
    padding: Gap.gap_sm,
    fontSize: FontSize.size_md,
    fontFamily: FontFamily.dMSans36pt,
    color: Color.casal950,
  },
  leftIconContainer: {
    position: 'absolute',
    left: Gap.gap_sm,
    justifyContent: 'center',
  },
  rightIconContainer: {
    position: 'absolute',
    right: Gap.gap_sm,
    justifyContent: 'center',
  },
});

export default InputField;
