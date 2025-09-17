// app/lavador/_layout.js
import React from 'react';
import { Drawer } from 'expo-router/drawer';

export default function LavadorLayout() {
  const scheme = useColorScheme()
  const isDark = scheme === 'dark'
  const bgColor = isDark ? '#000' : '#fff'
  const fgColor = isDark ? '#fff' : '#000'
  return (
    <Drawer screenOptions={{headerShown: true, headerStyle: { backgroundColor: bgColor,}, headerTintColor: fgColor, 
    sceneContainerStyle: { backgroundColor: bgColor, },}}>
      <Drawer.Screen name="index" options={{ title: 'Inicio' }}/>
      <Drawer.Screen name="actividades" options={{ title: 'Actividades' }}/>  
      <Drawer.Screen name="Dashboard" options={{ title: 'Dashboard',
        drawerItemStyle: { display: 'none' }, }}/>
      <Drawer.Screen name="Solicitudes" options={{ title: 'Solicitudes Ocultas',
          drawerItemStyle: { display: 'none' }, }}/>
    </Drawer>
  );
}