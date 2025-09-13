// app/(auth)/_layout.js
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { useUserRole } from '../../hooks/useUserRole';
import { drawerRoutes } from '../../src/routesConfig';

export default function AuthLayout() {
  const role = useUserRole();
  return (
  <Drawer
      screenOptions={{ headerShown: true }}
      drawerContentOptions={{ activeTintColor: '#e91e63' }}
    >
      {drawerRoutes
        .filter(route => !route.roles || route.roles.includes(role))
        .map(route => (
          <Drawer.Screen
            key={route.name}
            name={route.name}            // Debe coincidir con el archivo .js
            options={{ title: route.label }}  
          />
        ))}
    </Drawer>

  );
}