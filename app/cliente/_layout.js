// app/cliente/_layout.js
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from 'react-native';
export default function ClienteLayout() {
  const scheme = useColorScheme()
  const isDark = scheme === 'dark'
  const bgColor = isDark ? '#000' : '#fff'
  const fgColor = isDark ? '#fff' : '#000'

  return (
  <Drawer initialRouteName="index" screenOptions={{
    headerShown: true,    
    headerStyle: { backgroundColor: bgColor,},
    headerTintColor: fgColor,
    sceneContainerStyle: { backgroundColor: bgColor, },
    drawerStyle: { backgroundColor: bgColor },
    drawerActiveTintColor: fgColor,
    drawerInactiveTintColor: fgColor, 
    drawerLabelStyle: { fontSize: 16, color: fgColor },
  }}>
    <Drawer.Screen name="index" options={{ title: 'Inicio' }}/>
    <Drawer.Screen name="menu" options={{ title: 'Menú' }}/>

    <Drawer.Screen name="solicitarlavado" options={{ title: 'Solicitar Lavado', drawerItemStyle: { display: "none" }, }}/>
    <Drawer.Screen name="prueba" options={{ title: 'Prueba', drawerItemStyle: { display: 'none' },}}/>
  </Drawer>
  );
}