// app/cliente/_layout.js
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useEffect, useState } from 'react';
import { Alert, useColorScheme } from 'react-native';
import { useAuth } from '../../context/AuthContext';
export default function ClienteLayout() {
  const scheme = useColorScheme()
  const isDark = scheme === 'dark'
  const bgColor = isDark ? '#000' : '#fff'
  const fgColor = isDark ? '#fff' : '#000'
  const { user, loading } = useAuth();
  const router = useRouter();
   const [hasAlerted, setHasAlerted] = useState(false);
  
useEffect(() => {
if (!loading && !user && !hasAlerted) {
  setHasAlerted(true);
  Alert.alert(
  'Sin sesión',
  'No has iniciado sesión. Ve a iniciar sesion o crea una cuenta.',
 [ { text: 'OK',
   onPress: () => router.replace('/auth'),},],
  { cancelable: false });}

    if (!loading && user && !['lavador', 'admin', 'cliente'].includes(user.role)) {
      // Puedes mostrar otra alerta para acceso denegado
      Alert.alert('Acceso denegado', 'No tienes cuenta.');
      router.replace('/');
    }
  }, [loading, user, hasAlerted]);

  // Mientras carga, o tras alert y redirección, no renderizamos el Drawer
  if (loading || !user || !['lavador', 'admin', 'cliente'].includes(user.role)) {
    return null;
  }

  return (
  <Drawer initialRouteName="index" screenOptions={{
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
    <Drawer.Screen name="solicitudeslista" options={{ title: 'Mis Solicitudes' }}/>
    <Drawer.Screen name="detalles" options={{ title: 'Detalles' ,drawerItemStyle: { display: 'none' },}}/>  
    <Drawer.Screen name="solicitarlavado" options={{ title: 'Solicitar Lavado', drawerItemStyle: { display: "none" }, }}/>
    <Drawer.Screen name="test" options={{ title: 'Test', drawerItemStyle: { display: 'none' },}}/>
    <Drawer.Screen name="prueba" options={{ title: 'Prueba', drawerItemStyle: { display: 'none' },}}/>
    <Drawer.Screen name="ajustes" options={{ title: 'Ajustes', drawerItemStyle: { display: 'none' },}}/>
    <Drawer.Screen name="encuesta" options={{ title: 'Encuesta', drawerItemStyle: { display: 'none' },}}/>
    <Drawer.Screen name="faq" options={{ title: 'Preguntas Frecuentes', drawerItemStyle: { display: 'none' },}}/>
    <Drawer.Screen name="legales" options={{ title: 'Legales', drawerItemStyle: { display: 'none' },}}/>
    <Drawer.Screen name="noticias" options={{ title: 'Noticias', drawerItemStyle: { display: 'none' },}}/>
    <Drawer.Screen name="regalos" options={{ title: 'Regalos', drawerItemStyle: { display: 'none' },}}/>
    <Drawer.Screen name="perfil" options={{ title: 'Perfil', drawerItemStyle: { display: 'none' },}}/>
    <Drawer.Screen name="solicituddetalle/[id]" options={{ title: 'Solicitud', drawerItemStyle: { display: 'none' }, }}/>
    <Drawer.Screen name="configuracion" options={{ title: 'Configuración', drawerItemStyle: { display: 'none' }, }}/>

  </Drawer>
  );
}