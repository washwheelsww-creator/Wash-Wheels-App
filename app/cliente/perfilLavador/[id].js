// /cliente/perfilLavador/[id].js
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../../firebase/firebase";
import useGlobalStyles from "../../../styles/global";

export default function PerfilLavador() {
  const params = useLocalSearchParams();
  const { id } = params ?? {};
  const router = useRouter();
  const styles = useGlobalStyles();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!id) {
          Alert.alert("Error", "ID de lavador no provisto.");
          router.back();
          return;
        }
        if (!db) throw new Error('Firestore "db" no está definido');

        const uid = String(id);
        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          Alert.alert("No encontrado", "Perfil de lavador no existe.");
          router.back();
          return;
        }

        if (mounted) setProfile(snap.data());
      } catch (err) {
        console.error("Error cargando perfil lavador:", err);
        Alert.alert("Error", "No se pudo cargar el perfil.");
        router.back();
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, router]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  if (!profile)
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text>No se encontró el perfil.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12, padding: 10 }}>
          <Text style={{ color: "#007AFF" }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12 }}>
        <Text style={{ color: "#007AFF" }}>← Regresar</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.containerScroll}>
        {profile.photoURL ? (
          <Image source={{ uri: profile.photoURL }} style={[styles.image, { alignSelf: "center" }]} />
        ) : (
          <View style={[styles.image, { backgroundColor: "#eee", justifyContent: "center", alignItems: "center" }]}>
            <Text style={{ color: "#666" }}>Sin foto</Text>
          </View>
        )}

        <Text style={[styles.h2, { marginTop: 12 }]}>{profile.displayName || profile.username || "Nombre"}</Text>
        <Text style={[styles.textMuted, { marginTop: 6 }]}>{profile.role || "Usuario"}</Text>

        <View style={{ marginTop: 16 }}>
          <Text style={styles.label}>Correo</Text>
          <Text style={styles.text}>{profile.email || "-"}</Text>

          <Text style={[styles.label, { marginTop: 12 }]}>Nombre de usuario</Text>
          <Text style={styles.text}>{profile.username || "-"}</Text>

          {profile.createdAt && (
            <>
              <Text style={[styles.label, { marginTop: 12 }]}>Miembro desde</Text>
              <Text style={styles.text}>
                {profile.createdAt.toDate ? profile.createdAt.toDate().toLocaleDateString() : String(profile.createdAt)}
              </Text>
            </>
          )}

          {/* Campos opcionales públicos si existen */}
          {profile.bio && (
            <>
              <Text style={[styles.label, { marginTop: 12 }]}>Sobre</Text>
              <Text style={styles.text}>{profile.bio}</Text>
            </>
          )}

          {profile.rating != null && (
            <>
              <Text style={[styles.label, { marginTop: 12 }]}>Calificación</Text>
              <Text style={styles.text}>{String(profile.rating)}</Text>
            </>
          )}
        </View>

        <TouchableOpacity
          style={[styles.btn, { marginTop: 20 }]}
          onPress={() => {
            // acción opcional: enviar mensaje, llamar, etc. por ahora volvemos
            router.back();
          }}
        >
          <Text style={styles.btnText}>Cerrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}