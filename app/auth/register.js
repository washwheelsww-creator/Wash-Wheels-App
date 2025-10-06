// app/auth/register.js
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import useGlobalStyles from '../../styles/global';

export default function Register() {
  const { role } = useLocalSearchParams();
  const styles = useGlobalStyles();
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
        router.replace('/cliente');
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
        onPress={() => router.replace({ pathname: '/auth/login', params: { role } })}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Text>
    </View>
  );
}