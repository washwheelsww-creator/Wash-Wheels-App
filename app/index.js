// app/index.js
import React from 'react';
import styles from "../styles/global"
import { View, Button, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;          // evita parpadeos
  const handleCliente = () => {
    if (!user) {
      router.push({ pathname: '/login', params: { role: 'cliente' } });
    } else {
      // Cualquiera que esté logueado (cliente o lavador) puede solicitar lavado
      router.replace('/cliente');
    }
  };

  const handleLavador = () => {
    if (!user) {
      router.push({ pathname: '/login', params: { role: 'lavador' } });
    } else if (user.role === 'lavador' || user.role === 'admin') {
      router.replace('/lavador');
    } else {
      Alert.alert('Acceso denegado', 'No tienes permisos para ser lavador');
    }
  };

  return (
  <View style={styles.container}>
   <Text style={styles.title}>Wash Wheels</Text>
    <TouchableOpacity style={styles.button} onPress={handleCliente}>
      <Text style={styles.buttonText}>Solicitar Lavado</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={handleLavador}>
      <Text style={styles.buttonText}>  Ser Lavador     </Text>
    </TouchableOpacity>
  </View>

  );
}