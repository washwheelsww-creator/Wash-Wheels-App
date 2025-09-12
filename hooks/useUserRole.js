// hooks/useUserRole.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';  // o donde manejes tu auth

export function useUserRole() {
  const { userProfile } = useContext(AuthContext);
  // Asegúrate de que `user.role` exista en tu contexto
  return userProfile?.role || 'guest';
}