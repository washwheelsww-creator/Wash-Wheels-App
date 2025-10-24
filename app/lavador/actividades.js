// app/lavador/actividades.js
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { db } from "../../firebase/firebase";

export default function ActividadesLavador() {
const [solicitudes, setSolicitudes] = useState([]);  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const snapshot = await getDocs(collection(db, "solicitudes"));
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((s) =>
            (s.status === "aceptada" || s.status === "terminada") &&
            s.coords?.latitude &&
            s.coords?.longitude
          );
        setSolicitudes(data);
      } catch (err) {
        console.error("Error al cargar actividades:", err);
        Alert.alert("Error", "No se pudieron cargar las actividades.");
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
            description={`Estado: ${s.status}`}
            pinColor={s.status === "aceptada" ? "orange" : "green"}
            onPress={() => router.push(`/lavador/solicitud/${s.id}`)}
          />
        ))}
      </MapView>

  <View style={{ position: "absolute", bottom: 0, width: "100%", padding: 12, backgroundColor: "#fff" }}>
    <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>Actividades en curso</Text>
    {solicitudes.map((s) => (
    <TouchableOpacity key={s.id} onPress={() => router.push(`/lavador/solicitud/${s.id}`)}
     style={{ padding: 10, marginBottom: 6, backgroundColor: s.status === "aceptada" ? "#FFF3CD" : "#D4EDDA", borderRadius: 6, }} >
    <Text>{s.clientName} - {s.carModel}</Text>
    <Text>Estado: {s.status}</Text>
    </TouchableOpacity>
        ))}
  </View>
</View>
  );
}