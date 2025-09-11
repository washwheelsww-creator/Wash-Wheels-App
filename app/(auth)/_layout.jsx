// app/(auth)/_layout.jsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'IniciarSesion',
};

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}