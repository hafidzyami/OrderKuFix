import React from 'react';
import { Text, StyleSheet, Pressable, ColorValue } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  color: ColorValue;
  opacity?: number;
  borderColor? : any;
}

export function ButtonCustom({ onPress, title, color, opacity, borderColor }: ButtonProps) {
  const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: color,
      opacity: opacity ?? 1,
      borderColor : borderColor // default opacity is 1 if not provided
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'black',
      opacity : 1
    },
  });

  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}
