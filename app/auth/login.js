// app/auth/login.js
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Campos vacíos', 'Por favor ingresa email y contraseña.');
    }
 setLoading(true);
    try {
      await signIn(email, password);
      // Tras login, redirige según param role
      if (role === 'lavador') {
        router.replace('/lavador');
      } else {
        router.replace('/cliente');}
    }  catch (error) {
      // Interpreta el código de Firebase
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
          break;
        default:
          // si es un Error genérico (por ejemplo: “Verifica tu correo…”),
          // muéstralo tal cual:
          mensaje = error.message || mensaje;
      }
      Alert.alert('Autenticación', mensaje);
    } finally {
      setLoading(false);
    }
  };



  return (
   <View style={styles.containerCenter}>
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
    </View>

  );
}