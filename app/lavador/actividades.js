// app/lavador/actividades.js
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";
import useGlobalStyles from "../../styles/global";

const initialLayout = { width: Dimensions.get("window").width };

const ActividadItem = ({ actividad, onPressCard }) => {
  const styles = useGlobalStyles();

  const handleCardPress = () => {
    if (typeof onPressCard === "function") onPressCard(actividad.id);
  };

  return (
    <TouchableOpacity onPress={handleCardPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{actividad.carModel || actividad.titulo || "Solicitud"}</Text>
        <Text style={styles.textMuted}>Estado: {actividad.status}</Text>
        <Text style={styles.textMuted}>Cliente: {actividad.clienteName || "-"}</Text>

      <View style={{ flexDirection: "row", marginTop: 8 }}>
          <TouchableOpacity onPress={handleCardPress} style={[styles.btn]} >
            <Text style={styles.btnText}>Ver </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};


export default function Actividades() {
  const styles = useGlobalStyles();
  const router = useRouter ();
  const { user, loading: authLoading } = useAuth();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "aceptadas", title: "Aceptadas" },
    { key: "terminadas", title: "Terminadas" },
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
    const q = query(collection(db, "solicitudes"), where("lavadorId", "==", uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => {
          const data = d.data();
          const coords =
            data.coords && data.coords.latitude != null && data.coords.longitude != null
              ? { latitude: data.coords.latitude, longitude: data.coords.longitude }
              : data.coords;
          return { id: d.id, ...data, coords };
        });

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

  const handleGoToSolicitud = (solicitudId) => {
    if (!solicitudId) return;
    router.push(`/lavador/solicitud/${encodeURIComponent(solicitudId)}`);
  };

   const handleGoToDetalle = (solicitudId, opts = {}) => {
    if (!solicitudId) return;
    const path = `/lavador/solicitud/${encodeURIComponent(solicitudId)}`;
    if (opts.focusOnMap) {
      router.push(`${path}?focusOnMap=true`);
    } else {
      router.push(path);
    }
  };

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
      <View style={ styles.screen}>
        <MapView style={{ height: 220 }} initialRegion={region} showsUserLocation>
          {aceptadas
            .filter((a) => a.coords && a.coords.latitude && a.coords.longitude)
            .map((a) => (
              <Marker
                key={a.id}
                coordinate={a.coords}
                title={a.clienteName || a.carModel || "Solicitud"}
                onPress={() => handleGoToDetalle(a.id, { focusOnMap: true })}
              />
            ))}
        </MapView>
      
        <FlatList
          data={aceptadas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
      <ActividadItem actividad={item} onPressCard={handleGoToSolicitud}  /> )}
          contentContainerStyle={{ padding: 16 }}
        />
      </View>
    );
  };

  const TerminadasRoute = () => {
    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
    return (
      <View>
      <FlatList
        data={terminadas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
      <ActividadItem actividad={item} onPressCard={handleGoToSolicitud}  /> )}
        contentContainerStyle={{ padding: 16 }}
        
        ListEmptyComponent={<Text style={{ padding: 16 }}>No hay actividades terminadas.</Text>}
      />
      </View>
    );
  };


  const renderScene = SceneMap({
    aceptadas: AceptadasRoute,
    terminadas: TerminadasRoute,
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
          indicatorStyle={{ backgroundColor: "#2d54c0ff" }}
          style={styles.background}
          labelStyle={styles.h3}
        />
      )}
    />
  );
}