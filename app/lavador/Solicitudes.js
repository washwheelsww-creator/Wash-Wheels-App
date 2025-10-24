// app/lavador/Solicitudes.js
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { db } from "../../firebase/firebase";

export default function SolicitudesMapa() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const snapshot = await getDocs(collection(db, "solicitudes"));
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((s) => s.coords?.latitude && s.coords?.longitude);
        setSolicitudes(data);
      } catch (err) {
        console.error("Error al cargar solicitudes:", err);
        Alert.alert("Error", "No se pudieron cargar las solicitudes.");
      }
    };

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permiso denegado", "No se puede acceder a tu ubicación.");
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        const coords = loc.coords;
        setRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (err) {
        console.error("Error al obtener ubicación:", err);
        Alert.alert("Error", "No se pudo obtener tu ubicación.");
      }
    };

    Promise.all([fetchSolicitudes(), getLocation()]).finally(() => setLoading(false));
  }, []);

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