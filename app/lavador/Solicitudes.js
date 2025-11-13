// app/lavador/Solicitudes.js
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";

export default function SolicitudesMapa() {
  const { user, loading: authLoading } = useAuth();

  const [solicitudes, setSolicitudes] = useState([]);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (authLoading) return; // esperar a que auth termine

    // Si no hay usuario autenticado, limpiar y salir
    if (!user) {
      if (typeof setSolicitudes === "function") setSolicitudes([]);
      if (typeof setLoading === "function") setLoading(false);
      return;
    }

    let unsubSnapshot = () => {};
    let mounted = true;

    const init = async () => {
      try {
        // Pedir ubicación
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Permiso denegado", "No se puede acceder a tu ubicación.");
          } else {
            const loc = await Location.getCurrentPositionAsync({});
            const coords = loc.coords;
            if (mounted) {
              setRegion({
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              });
            }
          }
        } catch (locErr) {
          console.warn("Error obteniendo ubicación:", locErr);
        }

        // Query: traer solo solicitudes pendientes y SIN washerId (nadie las aceptó)
        const q = query(
          collection(db, "solicitudes"),
          where("status", "==", "pendiente"),
          where("washerId", "==", null)
        );

        // Listener en tiempo real
        unsubSnapshot = onSnapshot(
          q,
          (snap) => {
            try {
              const data = snap.docs
                .map((d) => ({ id: d.id, ...d.data() }))
                .filter((s) => s.coords?.latitude && s.coords?.longitude);

              if (mounted) setSolicitudes(data);
              if (mounted) setLoading(false);
            } catch (procErr) {
              console.error("Procesando snapshot:", procErr);
              if (mounted) setLoading(false);
            }
          },
          (err) => {
            console.error("Snapshot error:", err);
            if (mounted) {
              Alert.alert("Error", err.message || "No se pudieron cargar las solicitudes.");
              setLoading(false);
            }
          }
        );
      } catch (err) {
        console.error("Error al inicializar:", err);
        if (mounted) {
          Alert.alert("Error", "No se pudo inicializar la pantalla.");
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      try {
        unsubSnapshot();
      } catch (e) {
        console.warn("Error al unsubscribir snapshot:", e);
      }
    };
  }, [user, authLoading]);

  if (loading || !region) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} region={region} showsUserLocation>
        {solicitudes.map((s) => (
          <Marker
            key={s.id}
            coordinate={s.coords}
            title={s.clientName}
            description={s.carModel}
            pinColor="red"
            onPress={() => router.push(`/lavador/solicitud/${s.id}`)}
          />
        ))}
      </MapView>
    </View>
  );
}