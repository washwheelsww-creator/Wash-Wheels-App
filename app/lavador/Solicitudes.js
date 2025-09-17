// app/lavador/Solicitudes.js
import React from 'react';
import { View, Text } from 'react-native';
import useGlobalStyles from '../../styles/global';

export default function Solicitudes() {
  const styles = useGlobalStyles();
  return (
    <View>
      <Text style={styles.textBase}>Pantalla de Solicitudes</Text>
    </View>
  );
}
