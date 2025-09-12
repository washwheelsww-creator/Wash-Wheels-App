// app/_layout.jsx
import { AuthProvider } from '../context/AuthContext';
import { Drawer } from 'expo-router/drawer';
import { drawerRoutes } from '../src/routesConfig';
import { useUserRole } from '../hooks/useUserRole';
import Constants from 'expo-constants';

function DrawerLayout() {
  const role = useUserRole();
  const env = Constants.manifest?.releaseChannel || 'development';

  const routesToShow = drawerRoutes.filter(route => {
    if (route.roles && !route.roles.includes(role)) return false;
    if (route.env && route.env !== env) return false;
    return true;
  });


  return (
    <Drawer>
      {routesToShow.map(route => (
        <Drawer.Screen
          key={route.name}
          name={route.name}
          options={{ drawerLabel: route.label }}
        />
      ))}
    </Drawer>

  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <DrawerLayout />
    </AuthProvider>
  );
}
