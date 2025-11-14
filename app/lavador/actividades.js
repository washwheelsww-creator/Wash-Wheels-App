// app/lavador/actividades.js
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, FlatList, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";
import useGlobalStyles from "../../styles/global";

const initialLayout = { width: Dimensions.get("window").width };

const ActividadItem = ({ actividad }) => {
  const styles = useGlobalStyles();
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{actividad.carModel || actividad.titulo || "Solicitud"}</Text>
      <Text style={styles.textMuted}>Estado: {actividad.status}</Text>
      <Text style={styles.textMuted}>Cliente: {actividad.clienteName || "-"}</Text>
      <Text style={styles.textMuted}>Ubicación: {actividad.coords ? `${actividad.coords.latitude.toFixed(5)}, ${actividad.coords.longitude.toFixed(5)}` : "-"}</Text>
    </View>
  );
};

export default function Actividades() {
  const styles = useGlobalStyles();
  const { user, loading: authLoading } = useAuth();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "aceptadas", title: "Aceptadas" },
    { key: "terminadas", title: "Terminadas" },
    { key: "canceladas", title: "Canceladas" },
  ]);

  const [aceptadas, setAceptadas] = useState([]);
  const [terminadas, setTerminadas] = useState([]);
  const [canceladas, setCanceladas] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadListeners = useCallback(() => {
    if (authLoading || !user) {
      setAceptadas([]); setTerminadas([]); setCanceladas([]); setLoading(false);
      return () => {};
    }

    const uid = user.uid;
    // Query: todas las solicitudes donde soy lavador
    const q = query(collection(db, "solicitudes"), where("lavadorId", "==", uid));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAceptadas(docs.filter((s) => s.status === "aceptada" || s.status === "en_proceso"));
        setTerminadas(docs.filter((s) => s.status === "terminada"));
        setCanceladas(docs.filter((s) => s.status === "cancelada"));
        setLoading(false);
      },
      (err) => {
        console.error("Actividades snapshot error:", err);
        Alert.alert("Error", "No se pudieron cargar tus actividades.");
        setLoading(false);
      }
    );

    return () => unsub();
  }, [authLoading, user]);

  useEffect(() => {
    const unsub = loadListeners();
    return () => {
      try { if (typeof unsub === "function") unsub(); } catch (e) {}
    };
  }, [loadListeners]);

  // Render scenes
  const AceptadasRoute = () => {
    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
    if (!aceptadas.length)
      return <FlatList data={[]} ListEmptyComponent={<Text style={{ padding: 16 }}>No hay actividades aceptadas.</Text>} />;

    // Center map on first actividad or default coords
    const first = aceptadas[0];
    const region = first?.coords
      ? {
          latitude: first.coords.latitude,
          longitude: first.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }
      : { latitude: 25.85, longitude: -97.5, latitudeDelta: 0.05, longitudeDelta: 0.05 };

    return (
      <View style={{ flex: 1 }}>
        <MapView style={{ height: 220 }} initialRegion={region} showsUserLocation>
          {aceptadas
            .filter((a) => a.coords && a.coords.latitude && a.coords.longitude)
            .map((a) => (
              <Marker key={a.id} coordinate={a.coords} title={a.clienteName || a.carModel || "Solicitud"} />
            ))}
        </MapView>

        <FlatList
          data={aceptadas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ActividadItem actividad={item} />}
          contentContainerStyle={{ padding: 16 }}
        />
      </View>
    );
  };

  const TerminadasRoute = () => {
    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
    return (
      <FlatList
        data={terminadas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActividadItem actividad={item} />}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={{ padding: 16 }}>No hay actividades terminadas.</Text>}
      />
    );
  };

  const CanceladasRoute = () => {
    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
    return (
      <FlatList
        data={canceladas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActividadItem actividad={item} />}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={{ padding: 16 }}>No hay actividades canceladas.</Text>}
      />
    );
  };

  const renderScene = SceneMap({
    aceptadas: AceptadasRoute,
    terminadas: TerminadasRoute,
    canceladas: CanceladasRoute,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: "#007AFF" }}
          style={styles.background}
          labelStyle={styles.Text}
        />
      )}
    />
  );
}