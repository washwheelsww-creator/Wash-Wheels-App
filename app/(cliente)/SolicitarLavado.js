// app/cliente/SolicitarLavado.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SolicitarLavado() {
  return (
    <View style={styles.container}>
      <Text>Pantalla de Solicitar Lavado</Text>
      {/* aquí tu formulario, mapa, subida de imagen, etc. */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 }
});