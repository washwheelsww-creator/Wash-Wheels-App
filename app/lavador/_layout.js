// app/lavador/_layout.js
import React from 'react';
import { Drawer } from 'expo-router/drawer';

export default function LavadorLayout() {
  return (
    <Drawer screenOptions={{ headerShown: true }}>
      <Drawer.Screen name="index" options={{ title: 'Inicio' }}/>
      <Drawer.Screen name="actividades" options={{ title: 'Actividades' }}/>  
      <Drawer.Screen name="Dashboard" options={{ title: 'Dashboard',
        drawerItemStyle: { display: 'none' }, }}/>
      <Drawer.Screen name="Solicitudes" options={{ title: 'Solicitudes Ocultas',
          drawerItemStyle: { display: 'none' }, }}/>
    </Drawer>
  );
}