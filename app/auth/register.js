// app/auth/register.js
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  const [showPassword, setShowPassword] = useState(false);

  const mapFirebaseError = (code) => {
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

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!passwordRegex.test(password)) {
    setLoading(false);
    setErrorField('password');
    setErrorMessage('La contraseña no cumple los requisitos.');
    Alert.alert(
      "Contraseña inválida",
      "Debe tener al menos 6 caracteres, incluir mayúsculas, minúsculas y números."
    );
    return;
    }

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

    try {
      await signUp({ email, password, username, displayName, role });
    Alert.alert(
    "Verificación enviada",
    "Revisa tu correo y confirma tu cuenta antes de iniciar sesión." );

    router.replace({ pathname: "/auth/login", params: { role } });

    } catch (e) {
      const code = e?.code || null;
      const mapped = mapFirebaseError(code);

      setErrorField(mapped.field);
      setErrorMessage(mapped.message);
console.log("Signup error:", e);
      if (code === 'auth/email-already-in-use') {
        Alert.alert(
          'Correo en uso',
          'Ese correo ya tiene una cuenta. ¿Qué prefieres hacer?',
          [ {
              text: 'Probar otro correo',
              onPress: () => {
                setErrorField('email');
                setErrorMessage('Elige otro correo.');
              }, },
            { text: 'Recuperar contraseña',
              onPress: () => { 
              router.push({ pathname: '/auth/forgot-password', params: { email } });
              }, },
            { text: 'Cerrar', style: 'cancel' },
          ],
        );
      } else if (code === 'auth/email-already-in-use-username') {
       Alert.alert(
          'Nombre de usuario no disponible',
          `El nombre ${username} ya está en uso.`,
        [{ text: 'Aceptar' }],
        );
      } else {
        Alert.alert('Error', mapped.message);
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <ScrollView contentContainerStyle={[styles.containerScroll, {justifyContent:"center", alignItems: "center" }]}>
      <Text style={styles.title}>Registrarse como {role}</Text>
      <TextInput placeholder="Username" onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Nombre" onChangeText={setDisplayName} style={styles.input} />
      <TextInput placeholder="Email" onChangeText={setEmail} style={styles.input} />
      
      <View style={[styles.input, {flexDirection: 'row', alignItems: 'center'}] }>
      <TextInput placeholder="Contraseña" secureTextEntry={!showPassword} onChangeText={setPassword} style={[styles.text14,{flex:1}]} />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}> 
      <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#666" style={{ marginLeft: 4}} />
      </TouchableOpacity>   
      </View>

      <Button title="Crear cuenta" onPress={handleSignup} />
      <Text style={styles.link} onPress={() => router.replace({ pathname: '/auth/login', params: { role } })} >
        ¿Ya tienes cuenta? Inicia sesión
      </Text>
    </ScrollView>
    </KeyboardAvoidingView>

  );
}