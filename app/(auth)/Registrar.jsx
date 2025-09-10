//(auth)/Registrar.jsx
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { registerUserWithProfile } from "../../firebase/firebaseService";
import styles from "../../styles/global";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "../../firebase/firebase";
async function isUsernameTaken(username) {
  const q = query(collection(db, 'users'), where('username', '==', username));
  const snap = await getDocs(q);
  return !snap.empty;
}

export default function Registrarse() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleSignup = async () => {
    if (!email || !password || !username || !displayName) {
      return Alert.alert("Completa todos los campos");
    }
    try {
      const taken = await isUsernameTaken(username);
      if (taken) { return Alert.alert( "Nombre de usuario en uso", "Elige otro nombre de usuario, este ya está registrado." ); }
      await registerUserWithProfile({ email, password, username, displayName });

      Alert.alert("Registro exitoso", "Verifica tu correo y luego inicia sesión");
      navigation.replace('Login');

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar</Text>

      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" placeholderTextColor="#b0b6abff"/>
      <TextInput style={styles.input} placeholder="Nombre a mostrar" value={displayName} onChangeText={setDisplayName} placeholderTextColor="#b0b6abff"/>
      <TextInput style={styles.input} placeholder="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"placeholderTextColor="#b0b6abff" />
    <View style={styles.passwordContainer}>
      <TextInput style={styles.passwordInput} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} placeholderTextColor="#b0b6abff"/>
        <TouchableOpacity onPress={() => setShowPassword((s) => !s)} style= {styles.iconButton}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} />
        </TouchableOpacity>
    </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}