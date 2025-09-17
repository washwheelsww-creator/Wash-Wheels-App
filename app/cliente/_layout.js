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
  <Drawer initialRouteName="index" screenOptions={{headerShown: true,    
    headerStyle: { backgroundColor: bgColor,},
    headerTintColor: fgColor,
    sceneContainerStyle: {
    backgroundColor: bgColor, },}}>
    <Drawer.Screen name="index" options={{ title: 'Inicio' }}/>
    <Drawer.Screen name="menu" options={{ title: 'Menú' }}/>

    <Drawer.Screen name="solicitarlavado" options={{ title: 'Solicitar Lavado', drawerItemStyle: { display: "none" }, }}/>
    <Drawer.Screen name="prueba" options={{ title: 'Prueba Oculta', drawerItemStyle: { display: 'none' },}}/>
  </Drawer>
  );
}