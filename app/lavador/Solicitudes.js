// app/lavador/Solicitudes.js
import Slider from "@react-native-community/slider";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";
import useGlobalStyles from "../../styles/global";

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function SolicitudesMapa() {
  const { user, loading: authLoading } = useAuth();
  const styles = useGlobalStyles();
  const [solicitudes, setSolicitudes] = useState([]);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [radioKm, setRadioKm] = useState(10);

  useEffect(() => {
    if (authLoading) return;
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
  
  const solicitudesFiltradas = solicitudes.filter((s) => {
    const dist = getDistanceKm(
      region.latitude,
      region.longitude,
      s.coords.latitude,
      s.coords.longitude
    );
    return dist <= radioKm;
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 12, backgroundColor: "#fff" }}>
        <Text>Radio: {radioKm} km</Text>
        <Slider
          minimumValue={0.25}
          maximumValue={10}
          step={1}
          value={radioKm}
          onValueChange={setRadioKm}
        />
      </View>

      <MapView style={{ flex: 1 }} region={region} showsUserLocation>
        <Circle
          center={{ latitude: region.latitude, longitude: region.longitude }}
          radius={radioKm * 1000} // km → metros
          strokeColor="rgba(0,122,255,0.5)"
          fillColor="rgba(0,122,255,0.1)"
        />

        {solicitudesFiltradas.map((s) => (
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

