// app/(auth)/register.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/global';

export default function Register() {
  const { role } = useSearchParams();
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSignup = async () => {
    try {
      await signUp({ email, password, username, displayName, role });
      // Tras registro, redirige según rol
      if (role === 'lavador') {
        router.replace('/lavador/Dashboard');
      } else {
        router.replace('/cliente/SolicitarLavado');
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse como {role}</Text>
      <TextInput placeholder="Username" onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Nombre" onChangeText={setDisplayName} style={styles.input} />
      <TextInput placeholder="Email" onChangeText={setEmail} style={styles.input} />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title="Crear cuenta" onPress={handleSignup} />
      <Text
        style={styles.link}
        onPress={() => router.push({ pathname: '/login', params: { role } })}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Text>
    </View>
  );
}