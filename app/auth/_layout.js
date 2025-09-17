// app/auth/_layout.js
import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
  <Stack screenOptions={{ headerShown: true,
    headerStyle: { backgroundColor: isDark ? '#000' : '#fff',},
    headerTintColor: isDark ? '#fff' : '#000',}}>
   <Stack.Screen name="login" />
   <Stack.Screen name="register" />
  </Stack>

  );
}