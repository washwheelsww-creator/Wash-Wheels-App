// app/lavador/Dashboard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useGlobalStyles from '../../styles/global';

export default function Dashboard() {
const styles = useGlobalStyles();
  return (
    <View style={styles.container}>
      <Text>Pantalla de Administrador (Lavador)</Text>
    </View>
  );
}
