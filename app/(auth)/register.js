// app/(auth)/register.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { role } = useSearchParams();
  const { signUp } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');

  async function handleSignup() {
    try {
      await signUp({ email, password, username, displayName, role });
      router.replace(role === 'Lavador' ? '/lavador' : '/cliente');
    } catch (e) {
      Alert.alert('Error al registrarse', e.message);
    }
  }

  return (
    <View>
      <TextInput placeholder="Username" onChangeText={setUsername} />
      <TextInput placeholder="Nombre" onChangeText={setDisplayName} />
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Contraseña" secureTextEntry onChangeText={setPassword} />
      <Button title="Crear cuenta" onPress={handleSignup} />
    </View>
  );
}