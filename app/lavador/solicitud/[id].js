// app/lavador/solicitud/[id].js
import * as Location from "expo-location"; // 👈 importa arriba
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, runTransaction, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../firebase/firebase";
import useGlobalStyles from "../../../styles/global";
 
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function DetalleSolicitud() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const styles = useGlobalStyles();
  const { user, loading: authLoading } = useAuth();

  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        const snap = await getDoc(doc(db, "solicitudes", id));
        if (snap.exists()) setSolicitud({ id: snap.id, ...snap.data() });
      } catch (err) {
        console.error("Error al cargar solicitud:", err);
        Alert.alert("Error", "No se pudo cargar la solicitud.");
      } finally {
        setLoading(false);
      }
    };
    fetchSolicitud();
  }, [id]);

const actualizarEstado = async (nuevoEstado) => {
  if (authLoading) {
    Alert.alert("Espera", "Inicializando autenticación, intenta de nuevo en unos segundos.");
    return;
  }

  if (!user) {
    Alert.alert("No autenticado", "Inicia sesión para realizar esta acción.");
    return;
  }

  const ref = doc(db, "solicitudes", id);
  setUpdating(true);

  try {
    // Caso: aceptar solicitud
    if (nuevoEstado === "aceptada") {
      if (user.role !== "lavador") {
        const msg = user.role
          ? `Tu rol es "${user.role}". Solo usuarios con rol "lavador" pueden aceptar solicitudes.`
          : "No tienes un rol asignado. Contacta al administrador.";
        Alert.alert("Acceso denegado", msg);
        setUpdating(false);
        return;
      }

      const payloadToUpdate = {
        lavadorId: user.uid,
        lavadorName: user.displayName ?? user.email ?? null,
        status: "aceptada",
        assigned: true,
      };

       const loc = await Location.getCurrentPositionAsync({});
      const distKm = getDistanceKm(
        loc.coords.latitude,
        loc.coords.longitude,
        solicitud.coords.latitude,
        solicitud.coords.longitude
      );

      if (distKm > 1) {
        Alert.alert(
          "Solicitud lejana",
          `La solicitud está a ${distKm.toFixed(2)} km. ¿Seguro que quieres aceptarla?`,
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Aceptar de todos modos",
              onPress: async () => {
                await runTransaction(db, async (transaction) => {
                  const snap = await transaction.get(ref);
                  if (!snap.exists()) throw new Error("Solicitud no encontrada.");
                  const data = snap.data();

                  if (data.lavadorId != null) throw new Error("Ya fue aceptada por otro lavador.");
                  if (data.status !== "pendiente") throw new Error(`Estado no válido: ${data.status}`);

                  transaction.update(ref, {
                    lavadorId: user.uid,
                    lavadorName: user.displayName ?? user.email ?? null,
                    status: "aceptada",
                    assigned: true,
                  });
                });

                setSolicitud((prev) => ({
                  ...prev,
                  status: "aceptada",
                  lavadorId: user.uid,
                  lavadorName: user.displayName ?? user.email ?? null,
                }));
                Alert.alert("Aceptada", "Has aceptado la solicitud.");
              },
            },
          ]
        );
        setUpdating(false);
        return;
      }

      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(ref);
        if (!snap.exists()) throw new Error("Solicitud no encontrada.");
        const data = snap.data();

        if (data.lavadorId != null) throw new Error("La solicitud ya fue aceptada por otro lavador.");
        if (data.status !== "pendiente") throw new Error(`Estado no válido: ${data.status}`);

        transaction.update(ref, payloadToUpdate);
      });

      setSolicitud((prev) => ({
        ...prev,
        ...payloadToUpdate,
      }));
      Alert.alert("Aceptada", "Has aceptado la solicitud.");
      setUpdating(false);
      return;
    }

    // Caso: liberar solicitud (volver a pendiente)
    if (nuevoEstado === "pendiente" && user.role === "lavador") {
      await updateDoc(ref, {
        status: "pendiente",
        lavadorId: null,
        lavadorName: null,
        assigned: false,
      });

      setSolicitud((prev) => ({
        ...prev,
        status: "pendiente",
        lavadorId: null,
        lavadorName: null,
        assigned: false,
      }));
      Alert.alert("Liberada", "Has liberado la solicitud, ahora está pendiente.");
      setUpdating(false);
      return;
    }

    // Otros cambios (terminada, cancelada)
    await updateDoc(ref, { status: nuevoEstado });
    setSolicitud((prev) => ({ ...prev, status: nuevoEstado }));
    Alert.alert("Estado actualizado", `La solicitud ahora está "${nuevoEstado}".`);
  } catch (err) {
    console.error("Error al actualizar estado:", err);
    if (err?.code === "permission-denied" || String(err).toLowerCase().includes("permission")) {
      Alert.alert("Sin permisos", "No estás autorizado para realizar esta acción. Verifica tu rol o el estado de la solicitud.");
    } else {
      Alert.alert("Error", err.message || "No se pudo actualizar la solicitud.");
    }
  } finally {
    setUpdating(false);
  }
};
  if (loading || !solicitud) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  const status = String(solicitud.status ?? "");
  const clienteName = String(solicitud.clienteName ?? "-");
  const carModel = String(solicitud.carModel ?? "Auto");
  const color = String(solicitud.color ?? "-");
  const serviceType = String(solicitud.serviceType ?? "-");
  const notes = String(solicitud.notes ?? "-");


return (
  <SafeAreaView style={styles.container}>
    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
      <Text style={{ color: styles.text?.color ?? "#007AFF" }}>← Regresar</Text>
    </TouchableOpacity>

    <Text style={[styles.h2, { marginBottom: 8 }]}>Solicitud</Text>

    {/* 👇 ScrollView con keyboardShouldPersistTaps */}
    <ScrollView
      contentContainerStyle={{ paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cliente</Text>
        <Text style={styles.text}>{clienteName}</Text>

        <Text style={[styles.cardTitle, { marginTop: 8 }]}>Auto</Text>
        <Text style={styles.text}>{carModel}</Text>

        <Text style={[styles.cardTitle, { marginTop: 8 }]}>Color</Text>
        <Text style={styles.text}>{color}</Text>

        <Text style={[styles.cardTitle, { marginTop: 8 }]}>Servicio</Text>
        <Text style={styles.text}>{serviceType}</Text>

        <Text style={[styles.cardTitle, { marginTop: 8 }]}>Notas</Text>
        <Text style={styles.text}>{notes}</Text>

        <Text style={[styles.cardTitle, { marginTop: 8 }]}>Estado</Text>
        <Text
          style={[
            styles.text,
            status === "pendiente"
              ? styles.pending
              : status === "aceptada"
              ? styles.value
              : status === "terminada"
              ? styles.done
              : styles.cancelled,
          ]}
        >
          {status || "-"}
        </Text>

        {solicitud.photoURL ? (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.cardTitle}>Foto</Text>
            <Image source={{ uri: solicitud.photoURL }} style={styles.media} />
          </View>
        ) : null}
      </View>

      <View style={{ marginTop: 16 }}>
        {status === "pendiente" && (
          <TouchableOpacity
            onPress={() => actualizarEstado("aceptada")}
            style={[styles.btn, styles.btnPrimary, { marginTop: 8 }]}
            disabled={updating}
          >
            <Text style={styles.btnText}>Aceptar solicitud</Text>
          </TouchableOpacity>
        )}

        {status === "aceptada" && (
          <>
            <TouchableOpacity
              onPress={() => actualizarEstado("terminada")}
              style={[styles.btn, styles.btnPrimary, { marginTop: 8 }]}
              disabled={updating}
            >
              <Text style={styles.btnText}>Marcar como terminada</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => actualizarEstado("pendiente")}
              style={[styles.btn, styles.btnDanger, { marginTop: 8 }]}
              disabled={updating}
            >
              <Text style={styles.btnText}>Liberar solicitud</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  </SafeAreaView>
);
}