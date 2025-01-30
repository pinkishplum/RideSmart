// components/Button.js

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Border, Color, FontSize, FontFamily, Gap } from '../GlobalStyles';

const Button = ({ title, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Color.tropicalRainForest600,
    borderRadius: Border.br_9xl,
    paddingVertical: Gap.gap_md,
    alignItems: 'center',
  },
  buttonText: {
    color: Color.white,
    fontSize: FontSize.size_lg, // Default font size
    fontWeight: '700',
    fontFamily: FontFamily.dMSans36pt,
  },
});

export default Button;
