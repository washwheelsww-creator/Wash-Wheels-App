//app/lavador/solicitud/[id].js
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../../firebase/firebase";

export default function DetalleSolicitud() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
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
    setUpdating(true);
    try {
      await updateDoc(doc(db, "solicitudes", id), { status: nuevoEstado });
      setSolicitud((prev) => ({ ...prev, status: nuevoEstado }));
      Alert.alert("Estado actualizado", `La solicitud ahora está "${nuevoEstado}".`);
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      Alert.alert("Error", "No se pudo actualizar la solicitud.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !solicitud) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12 }}>
        <Text style={{ color: "#007AFF" }}>← Regresar</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>Solicitud</Text>
      <Text>Cliente: {solicitud.clientName}</Text>
      <Text>Auto: {solicitud.carModel}</Text>
      <Text>Color: {solicitud.color}</Text>
      <Text>Servicio: {solicitud.serviceType}</Text>
      <Text>Notas: {solicitud.notes}</Text>
      <Text>Estado: {solicitud.status}</Text>

      {solicitud.photoURL ? (
        <View style={{ marginVertical: 12 }}>
          <Text>Foto:</Text>
          <Image source={{ uri: solicitud.photoURL }} style={{ width: "100%", height: 200 }} />
        </View>
      ) : null}

      {solicitud.status === "pending" && (
        <TouchableOpacity
          onPress={() => actualizarEstado("aceptada")}
          style={{ marginTop: 24, backgroundColor: "#28A745", padding: 12, borderRadius: 8 }}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>Aceptar solicitud</Text>
        </TouchableOpacity>
      )}

      
      {solicitud.status === "aceptada" && (
        <TouchableOpacity
          onPress={() => actualizarEstado("terminada")}
          style={{ marginTop: 24, backgroundColor: "#007AFF", padding: 12, borderRadius: 8 }}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>Marcar como terminada</Text>
        </TouchableOpacity>
      )}

      {solicitud.status === "aceptada" && (
     <TouchableOpacity
      onPress={() => actualizarEstado("pendiente")}
    style={{ marginTop: 12, backgroundColor: "#DC3545", padding: 12, borderRadius: 8 }}
  >
    <Text style={{ color: "#fff", textAlign: "center" }}>Cancelar solicitud</Text>
  </TouchableOpacity>
)}

    </View>
  );
}