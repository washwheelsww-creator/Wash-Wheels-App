// app/lavador/_layout.js
import { Slot, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useEffect, useState } from 'react';
import { Alert, useColorScheme } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LavadorLayout() {
  const scheme = useColorScheme();
  const router = useRouter();
  const { user, loading } = useAuth();
  const isDark = scheme === 'dark'
  const bgColor = isDark ? '#000' : '#fff'
  const fgColor = isDark ? '#fff' : '#000'
  const [hasAlerted, setHasAlerted] = useState(false);

  useEffect(() => {
if (!loading && !user && !hasAlerted) {
  setHasAlerted(true);
  Alert.alert(
  'Sin sesión',
  'No has iniciado sesión como lavador. Ve a iniciar sesion o crea una cuenta.',
 [ { text: 'OK',
   onPress: () => router.replace({ pathname: '/auth', params: { role: 'lavador' }, }),},],
  { cancelable: false });}

    if (!loading && user && !['lavador', 'admin'].includes(user.role)) {
      // Puedes mostrar otra alerta para acceso denegado
      Alert.alert('Acceso denegado', 'No tienes permisos de lavador.');
      router.replace('/');
    }
  }, [loading, user, hasAlerted]);

  // Mientras carga, o tras alert y redirección, no renderizamos el Drawer
  if (loading || !user || !['lavador', 'admin'].includes(user.role)) {
    return null;
  }
  return (
    <Drawer initialRouteName="index" screenOptions={{headerShown: true,    
    headerStyle: { backgroundColor: bgColor,},
    headerTintColor: fgColor,
    sceneContainerStyle: { backgroundColor: bgColor, },
    drawerStyle: { backgroundColor: bgColor },
    drawerActiveTintColor: fgColor,
    drawerInactiveTintColor: fgColor, 
    drawerLabelStyle: { fontSize: 16, color: fgColor },
  }}>
  <Drawer.Screen name="index" options={{ title: 'Inicio' }}/>
  <Drawer.Screen name="actividades" options={{ title: 'Actividades' }}/>
  <Drawer.Screen name="Dashboard" options={{ title: 'Dashboard', drawerItemStyle: { display: 'none' }, }}/>
  <Drawer.Screen name="Solicitudes" options={{ title: 'Solicitudes', drawerItemStyle: { display: 'none' }, }}/>
  <Drawer.Screen name="perfil" options={{ title: 'Perfil', drawerItemStyle: { display: 'none' }, }}/>
  <Slot />
 </Drawer>
  );
}