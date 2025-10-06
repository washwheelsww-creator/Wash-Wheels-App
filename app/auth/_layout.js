// app/auth/_layout.js
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
export default function AuthLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark'
  const bgColor = isDark ? '#000' : '#fff';
  const fgColor = isDark ? '#fff' : '#000';


  return (
    <Stack initialRouteName="login" screenOptions={{headerShown: true,    
        headerStyle: { backgroundColor: bgColor,},
        headerTintColor: fgColor,
        sceneContainerStyle: { backgroundColor: bgColor, },
        drawerStyle: { backgroundColor: bgColor },
        drawerActiveTintColor: fgColor,
        drawerInactiveTintColor: fgColor, 
        drawerLabelStyle: { fontSize: 16, color: fgColor },
      }}>
<Stack.Screen name="login"options={{ title: 'Iniciar Sesión',
 drawerItemStyle: { display: 'none' }, }}/>
 <Stack.Screen name="register"  options={{ title: 'Registrarse',
 drawerItemStyle: { display: 'none' }, }}/>
  </Stack>
  );
}