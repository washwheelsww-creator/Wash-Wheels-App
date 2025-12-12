// app/auth/login.js
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import useGlobalStyles from '../../styles/global';

export default function Login() {
  const { role } = useLocalSearchParams();
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const styles = useGlobalStyles();
  const [loading, setLoading] = useState(false);
  const [showResendLink, setShowResendLink] = useState(false);
  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Campos vacíos', 'Por favor ingresa email y contraseña.');
    }
 setLoading(true);
    try {
      await signIn(email, password);
      if (role === 'lavador') {
        router.replace('/lavador');
      } else {
        router.replace('/cliente');}
    }  catch (error) {
      let mensaje = 'Error al iniciar sesión.';
      switch (error.code) {
        case 'auth/user-not-found':
          mensaje = 'No existe una cuenta con este correo.';
          break;
        case 'auth/wrong-password':
          mensaje = 'La contraseña es incorrecta.';
          break;
        case 'auth/invalid-email':
          mensaje = 'El formato de correo no es válido.';
          break;
        case 'auth/invalid-credential':
          mensaje = 'Este usuario no existe o error.';
          break;
        case 'auth/email-not-verified':
        case 'auth/invalid-action-code':
          mensaje = 'Debes verificar tu correo antes de continuar.';
          setShowResendLink(true);
          break;
        default:
          mensaje = error.message || mensaje;
      }
      Alert.alert('Autenticación', mensaje);
    } finally {
      setLoading(false);
    }
  };



  return (
  <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
  <ScrollView contentContainerStyle={[styles.containerScroll, {justifyContent:"center", alignItems: "center" }]}>
      <Text style={styles.title}>Iniciar sesión como {role}</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Contraseña" secureTextEntry onChangeText={setPassword} style={styles.input}
      />
      <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleLogin}>
       <Text style={styles.btnText}>{String("Entrar")}</Text>
      </TouchableOpacity>
    <Text
        style={styles.link}
        onPress={() => router.replace({ pathname: '/auth/register', params: { role } })}
      >
        ¿No tienes cuenta? Regístrate
      </Text>
    {showResendLink && ( 
      <Text style={styles.link} onPress={async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      Alert.alert("Correo reenviado", "Revisa tu bandeja de entrada.");
    } else {
      Alert.alert("Error", "Primero inicia sesión con tu correo y contraseña.");
    }
  }}
>
  ¿No recibiste el correo? Reenviar verificación
</Text>)}
</ScrollView>
    </KeyboardAvoidingView>

  );
}