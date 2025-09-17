// app/(cliente)/Prueba.js
import React from 'react';
import { View, Text } from 'react-native';
import useGlobalStyles from '../../styles/global';

export default function prueba() {
  const styles = useGlobalStyles();
  return (
    <View>
      <Text style={styles.textBase}>Pantalla de prueba para cliente</Text>
    </View>
  );
}
