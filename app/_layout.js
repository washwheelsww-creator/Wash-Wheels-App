// app/_layout.js
import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* Sin hijos aquí: Expo Router montará index + cada grupo */}
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}