// app/lavador/_layout.js
import { useRouter } from 'expo-router';
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
      Alert.alert('Acceso denegado', 'No tienes permisos de lavador.');
      router.replace('/');
    }
  }, [loading, user, hasAlerted]);

  if (loading || !user || !['lavador', 'admin'].includes(user.role)) {
    return null;
  }

  return (
    <Drawer initialRouteName="index" screenOptions={{
    animation: 'none',
    gestureEnabled: false,
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
  <Drawer.Screen name="Solicitudes" options={{ title: 'Solicitudes'}}/>
  <Drawer.Screen name="actividades" options={{ title: 'Actividades' }}/>

  <Drawer.Screen name="menu/perfil_lav" options={{ title: 'Perfil', drawerItemStyle: { display: 'none' } }} />
  <Drawer.Screen name="solicitud/[id]" options={{ title: 'Solicitud', drawerItemStyle: { display: 'none' } }} />
  <Drawer.Screen name="menu/regalos_lav" options={{ title: 'Regalos', drawerItemStyle: { display: 'none' } }} />
  <Drawer.Screen name="menu/ajustes_lav" options={{ title: 'Ajustes', drawerItemStyle: { display: 'none' } }} />
  <Drawer.Screen name="menu/legales_lav" options={{ title: 'Legales', drawerItemStyle: { display: 'none' } }} />
  <Drawer.Screen name="menu/encuesta_lav" options={{ title: 'Encuesta', drawerItemStyle: { display: 'none' } }} />
  <Drawer.Screen name="menu/noticias_lav" options={{ title: 'Noticias', drawerItemStyle: { display: 'none' } }} />
  <Drawer.Screen name="menu/faq_lav" options={{ title: 'Preguntas Frecuentes', drawerItemStyle: { display: 'none' } }} />
  <Drawer.Screen name="menu/configuracion_lav" options={{ title: 'Configuración', drawerItemStyle: { display: 'none' } }} />
  <Drawer.Screen name="Dashboard" options={{ drawerItemStyle: { display: 'none' } }} />
    </Drawer>

  );
}