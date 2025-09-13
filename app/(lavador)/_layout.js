// app/lavador/_layout.js
import React from 'react';
import { Drawer } from 'expo-router/drawer';

export default function LavadorLayout() {
  return (
    <Drawer screenOptions={{ headerTitleAlign: 'center' }}>
      <Drawer.Screen name="Dashboard" options={{ title: 'Inicio' }} />
      <Drawer.Screen name="SolicitarLavado" options={{ title: 'Solicitar Lavado' }} />
    </Drawer>
  );
}