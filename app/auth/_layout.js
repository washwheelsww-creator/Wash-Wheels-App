// app/auth/_layout.js
import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function AuthLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark'

  return (
  <Stack screenOptions={{ headerShown: true,
    headerStyle: { backgroundColor: isDark ? '#000' : '#fff',},
    headerTintColor: isDark ? '#fff' : '#000',}}>
   <Stack.Screen name="login" />
   <Stack.Screen name="register" />
  </Stack>

  );
}