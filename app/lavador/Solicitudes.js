// app/lavador/Solicitudes.js
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";
import useGlobalStyles from "../../styles/global";

export default function SolicitudesMapa() {
  const { user, loading: authLoading } = useAuth();
  const styles = useGlobalStyles();
  const [solicitudes, setSolicitudes] = useState([]);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;         // espera auth listo
    if (!user) {
      setSolicitudes([]);
      setLoading(false);
      return;
    }

    let unsub = () => {};
    let mounted = true;

    const init = async () => {
      try {
        // pedir permiso y ubicación
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
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

        // Query: traer solo solicitudes pendientes y SIN lavadorId (nadie las aceptó)
        const q = query(
          collection(db, "solicitudes"),
          where("status", "==", "pendiente"),
          where("lavadorId", "==", null)
        );

        unsub = onSnapshot(
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
      try { unsub(); } catch (e) { console.warn("Error unsubscribing:", e); }
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
            title={s.clienteName || s.clientName || "Solicitud"}
            description={s.carModel}
            pinColor="red"
            onPress={() => router.push(`/lavador/solicitud/${s.id}`)}
          />
        ))}
      </MapView>
    </View>
  );
}

