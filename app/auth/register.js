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
  const [loading, setLoading] = useState(false);
  const [errorField, setErrorField] = useState(null); // 'email' | 'username' | 'password' | null
  const [errorMessage, setErrorMessage] = useState('');

  const mapFirebaseError = (code) => {
    // Mapear códigos comunes a mensajes en español
    switch (code) {
      case 'auth/email-already-in-use':
        return { field: 'email', message: 'Ese correo ya está registrado.' };
      case 'auth/invalid-email':
        return { field: 'email', message: 'Ingresa un correo con formato válido.' };
      case 'auth/weak-password':
        return { field: 'password', message: 'La contraseña debe tener al menos 6 caracteres.' };
      case 'auth/user-not-found':
        return { field: 'email', message: 'No existe una cuenta con ese correo.' };
      case 'auth/wrong-password':
        return { field: 'password', message: 'Contraseña incorrecta.' };
      default:
        return { field: null, message: 'Error al crear la cuenta. Intenta de nuevo.' };
    }
  };


  const handleSignup = async () => {
    setErrorField(null);
    setErrorMessage('');
    setLoading(true);

    // validaciones cliente
    if (!username.trim()) {
      setLoading(false);
      setErrorField('username');
      setErrorMessage('Introduce un nombre de usuario.');
      return;
    }
    if (!email.trim()) {
      setLoading(false);
      setErrorField('email');
      setErrorMessage('Introduce un correo electrónico.');
      return;
    }
    if (password.length < 6) {
      setLoading(false);
      setErrorField('password');
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }


    try {
      await signUp({ email, password, username, displayName, role });
      // Tras registro, redirige según rol
      if (role === 'lavador') {
        router.replace('/lavador/Dashboard');
      } else {
        router.replace('/cliente');
      }
    } catch (e) {
      // intentar obtener código de error estándar de Firebase
      const code = e?.code || null;
      const mapped = mapFirebaseError(code);

      setErrorField(mapped.field);
      setErrorMessage(mapped.message);

      // comportamiento comunicativo según tipo de error
      if (code === 'auth/email-already-in-use') {
        // alerta con opciones útiles
        Alert.alert(
          'Correo en uso',
          'Ese correo ya tiene una cuenta. ¿Qué prefieres hacer?',
          [
            {
              text: 'Probar otro correo',
              onPress: () => {
                setErrorField('email');
                setErrorMessage('Elige otro correo.');
              },
            },
            {
              text: 'Recuperar contraseña',
              onPress: () => {
                // redirigir a pantalla de recuperar o disparar flujo de recuperación
                router.push({ pathname: '/auth/forgot-password', params: { email } });
              },
            },
            { text: 'Cerrar', style: 'cancel' },
          ],
        );
      } else if (code === 'auth/email-already-in-use-username') {
        // si tu backend devuelve un custom code para username collision
        const suggestions = suggestUsernames(username || displayName || 'usuario');
        Alert.alert(
          'Nombre de usuario no disponible',
          `El nombre ${username} ya está en uso. Prueba una de estas opciones: ${suggestions.join(', ')}`,
          [{ text: 'Aceptar' }],
        );
      } else {
        // alerta genérica más amigable
        Alert.alert('Error', mapped.message);
      }
    } finally {
      setLoading(false);
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