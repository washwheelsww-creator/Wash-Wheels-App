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

  async function handleLogin() {
    try {
      await signIn(email, password);
      router.replace(role === 'Lavador' ? '/lavador' : '/cliente');
    } catch (e) {
      Alert.alert('Error al iniciar sesión', e.message);
    }
  }

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Contraseña" secureTextEntry onChangeText={setPassword} />
      <Button title="Ingresar" onPress={handleLogin} />
      <Button title="Crear cuenta" onPress={() => router.push({ pathname: '/auth/register', params: { role } })} />
    </View>
  );
}