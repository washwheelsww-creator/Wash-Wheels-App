// app/(auth)/login.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { role } = useSearchParams();
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      // Tras login, redirige según param role
      if (role === 'lavador') {
        router.replace('/lavador/Dashboard');
      } else {
        router.replace('/cliente/SolicitarLavado');}
    } catch (e) {
      Alert.alert('Error', e.message);
    }};


  return (
   <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión como {role}</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} style={styles.input} />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title="Entrar" onPress={handleLogin} />
      <Text
        style={styles.link}
        onPress={() => router.push({ pathname: '/register', params: { role } })}
      >
        ¿No tienes cuenta? Regístrate
      </Text>
    </View>

  );
}