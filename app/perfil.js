//wash-wheels-app/wash-wheels-app/app/perfil.js
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from "../components/BackButton";
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
        <BackButton />
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>Usuario:</Text>
          <Text style={styles.textBase}>{user.username}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.textBase}>{user.displayName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Rol:</Text>
          <Text style={styles.textBase}>{user.role}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.textBase}>{user.email}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
