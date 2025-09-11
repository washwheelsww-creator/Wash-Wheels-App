// src/routesConfig.js
export const drawerRoutes = [

  { name: 'actividades',  label: 'Actividades' },
  { name: 'perfil',       label: 'Perfil' },
  // Estas dos son las especiales
  {
    name: 'reporte',
    label: 'Reporte Avanzado',
    roles: ['admin'],            // solo admins lo ven
  },
  {
    name: 'ajustes-criticos',
    label: 'Ajustes Críticos',
    env: 'production',           // solo en prod
  },
];