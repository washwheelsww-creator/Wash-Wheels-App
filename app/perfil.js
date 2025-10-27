//wash-wheels-app/wash-wheels-app/app/perfil.js
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from "../context/AuthContext";
import useGlobalStyles from "../styles/global";

export default function Perfil() {
  const { user, logout } = useAuth();
  const styles = useGlobalStyles();
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.textBase}> No hay usuario autenticado.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
    <Text style={{ color: styles.text?.color ?? "#007AFF" }}>← Regresar</Text>
    </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>Usuario:</Text>
          <Text style={styles.text}>{user.username}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.text}>{user.displayName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Rol:</Text>
          <Text style={styles.text}>{user.role}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.text}>{user.email}</Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={() => logout()}>
          <Text>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
