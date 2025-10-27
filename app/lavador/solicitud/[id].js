//app/lavador/solicitud/[id].js
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../../firebase/firebase";
import useGlobalStyles from "../../../styles/global";

export default function DetalleSolicitud() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const styles = useGlobalStyles();
  
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  useEffect(() => {
  const fetchSolicitud = async () => {
    try {  const snap = await getDoc(doc(db, "solicitudes", id));
      if (snap.exists()) setSolicitud({ id: snap.id, ...snap.data() });
    } catch (err) { console.error("Error al cargar solicitud:", err);
      Alert.alert("Error", "No se pudo cargar la solicitud.");
    } finally {
      setLoading(false);
    } };
    fetchSolicitud();
  }, [id]);

  const actualizarEstado = async (nuevoEstado) => {
    setUpdating(true);
    try {
      await updateDoc(doc(db, "solicitudes", id), { status: nuevoEstado });
      setSolicitud((prev) => ({ ...prev, status: nuevoEstado }));
      Alert.alert("Estado actualizado", `La solicitud ahora está "${nuevoEstado}".`);
    } catch (err) { console.error("Error al actualizar estado:", err);
      Alert.alert("Error", "No se pudo actualizar la solicitud.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !solicitud) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  
  const status = String(solicitud.status ?? "");
  const clientName = String(solicitud.clientName ?? "-");
  const carModel = String(solicitud.carModel ?? "Auto");
  const color = String(solicitud.color ?? "-");
  const serviceType = String(solicitud.serviceType ?? "-");
  const notes = String(solicitud.notes ?? "-");

  return (
  <SafeAreaView style={styles.containerCenter}>
  <View >
    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
    <Text style={{ color: styles.text?.color ?? "#007AFF" }}>← Regresar</Text>
    </TouchableOpacity>
    <Text style={[styles.h2, { marginBottom: 8 }]}>Solicitud</Text>

  <View style={styles.card}>
    <Text style={styles.cardTitle}>Cliente</Text>
    <Text style={styles.text}>{clientName}</Text>

    <Text style={[styles.cardTitle, { marginTop: 8 }]}>Auto</Text>    <Text style={styles.text}>{carModel}</Text>
    <Text style={[styles.cardTitle, { marginTop: 8 }]}>Color</Text>   <Text style={styles.text}>{color}</Text>
    <Text style={[styles.cardTitle, { marginTop: 8 }]}>Servicio</Text><Text style={styles.text}>{serviceType}</Text>
    <Text style={[styles.cardTitle, { marginTop: 8 }]}>Notas</Text>   <Text style={styles.text}>{notes}</Text>

    <Text style={[styles.cardTitle, { marginTop: 8 }]}>Estado</Text>  <Text style={[ styles.text, status === "pendiente" ? styles.pending
    : status === "aceptada" ? styles.value : status === "terminada" ? styles.done : styles.cancelled, ]} > {status || "-"} </Text>

   {solicitud.photoURL ? (
   <View style={{ marginTop: 12 }}>
    <Text style={styles.cardTitle}>Foto</Text> <Image source={{ uri: solicitud.photoURL }} style={styles.media} />
   </View> ) : null}
  </View>

  <View style={{ marginTop: 16 }}> 
  {status === "pendiente" && (
    <TouchableOpacity onPress={() => actualizarEstado("aceptada")} style={[styles.btn, styles.btnPrimary, { marginTop: 8 }]} disabled={updating}>
      <Text style={styles.btnText}>Aceptar solicitud</Text>
    </TouchableOpacity> )}

  {status === "aceptada" && (<>
    <TouchableOpacity onPress={() => actualizarEstado("terminada")} style={[styles.btn, styles.btnPrimary, { marginTop: 8 }]} disabled={updating}>
      <Text style={styles.btnText}>Marcar como terminada</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => actualizarEstado("pendiente")} style={[styles.btn, styles.btnDanger, { marginTop: 8 }]} disabled={updating}>
      <Text style={styles.btnText}>Cancelar solicitud</Text>
    </TouchableOpacity> </> )}
      </View>
    </View>
</SafeAreaView>
  );
}