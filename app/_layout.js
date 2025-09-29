// app/_layout.js
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark'
  const bgColor = isDark ? '#000' : '#fff'
  const fgColor = isDark ? '#fff' : '#000'

  return (
    <AuthProvider>
      <Stack screenOptions={{headerShown: true}} />
    </AuthProvider>
  );
}