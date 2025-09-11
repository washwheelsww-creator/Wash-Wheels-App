// app/_layout.jsx
import { Drawer } from 'expo-router/drawer';
import { drawerRoutes } from '../src/routesConfig'
import { useUserRole } from '../hooks/useUserRole';
import Constants from 'expo-constants';

export default function RootLayout() {
  const role = useUserRole();               // e.g. 'user' o 'admin'
  const env  = Constants.manifest?.releaseChannel || 'development';

  // Filtrado dinámico
  const routesToShow = drawerRoutes.filter(route => {
    // Si tiene roles y el rol actual no está ahí, lo excluye
    if (route.roles && !route.roles.includes(role)) {
      return false;
    }
    // Si tiene env y no coincide, lo excluye
    if (route.env && route.env !== env) {
      return false;
    }
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