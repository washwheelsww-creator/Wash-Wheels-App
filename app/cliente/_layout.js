// app/cliente/_layout.js
import React from 'react';
import { Drawer } from 'expo-router/drawer';

export default function ClienteLayout() {
  return (
    <Drawer initialRouteName="index" screenOptions={{ headerShown: true }}>
      {/* Visible en el menú */}
      <Drawer.Screen name="index" options={{ title: 'Inicio' }}/>
      <Drawer.Screen name="menu" options={{ title: 'Menú' }}/>

      {/* Ocultas en el menú, pero accesibles vía router.push */}
      <Drawer.Screen name="SolicitarLavado" options={{
          title: 'Solicitar Lavado', drawerItemStyle: { display: "none" }, }}/>
      <Drawer.Screen
        name="prueba" options={{ title: 'Prueba Oculta',
          drawerItemStyle: { display: 'none' },}}/>
    </Drawer>
  );
}