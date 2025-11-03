// app/cliente/perfil.js
import { useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import useGlobalStyles from "../../styles/global";

export default function PerfilCliente() {
  const styles = useGlobalStyles();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  if (!user) {
    return (
    <SafeAreaView style={styles.container}>
    <View style={{ width: "100%", maxWidth: 720, alignSelf: "center", padding: 12 }}>
      <Text style={styles.h2}>Mi Perfil</Text>
      <TouchableOpacity onPress={() => router.back()}> <Text>Regresar</Text> </TouchableOpacity>
       <Text style={styles.text}>No hay usuario autenticado.</Text>
      <TouchableOpacity style={[styles.btn, styles.btnPrimary, { marginTop: 16 }]} onPress={() => router.replace("/auth")}>
       <Text style={styles.btnText}>Iniciar sesión</Text>
      </TouchableOpacity>
    </View>
      </SafeAreaView>
    );
  }
  const username = String(user.username ?? user.id ?? "-");
  const displayName = String(user.displayName ?? user.name ?? "-");
  const role = String(user.role ?? "-");
  const email = String(user.email ?? "-");
  return (
  <SafeAreaView style={styles.container}>
  <View style={styles.header}>
    <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12 }}>
        <Text style={{ color: "#007AFF" }}>← Regresar</Text>
      </TouchableOpacity>
    <Text style={styles.h2}>Mi Perfil</Text>
    <View style={{ width: 40 }} />
  </View>

  <ScrollView contentContainerStyle={{ padding: 16 }}>
  <View style={{ width: "100%", maxWidth: 720, }}>
    <View style={{ marginBottom: 12 }}> <Text style={styles.label}>Usuario</Text> <Text style={styles.text}>{username}</Text> </View>
    <View style={{ marginBottom: 12 }}> <Text style={styles.label}>Nombre</Text> <Text style={styles.text}>{displayName}</Text> </View>
    <View style={{ marginBottom: 12 }}> <Text style={styles.label}>Rol</Text> <Text style={styles.text}>{role}</Text> </View>
    <View style={{ marginBottom: 12 }}> <Text style={styles.label}>Email</Text> <Text style={styles.text}>{email}</Text> </View>
 <View style={{ flexDirection: "row", gap: 12, marginTop: 16}}>
    <TouchableOpacity style={[styles.btn, {width:'170'}]} onPress={() => router.push("/cliente/ajustes")} >
      <Text style={styles.btnText}>Editar perfil</Text>
    </TouchableOpacity>

    <TouchableOpacity style={[styles.btnDanger,{width:'170'}]} onPress={async () => { try { await signOut(); router.replace("/auth"); 
    } catch (err) { console.error("Sign out error:", err); } }} >
      <Text style={styles.btnText}>Cerrar sesión</Text>
    </TouchableOpacity>
    </View>
  </View>
  </ScrollView>
</SafeAreaView>
  );
}