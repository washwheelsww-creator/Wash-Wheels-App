// cliente/solicitudeslista.js
import { useRouter } from 'expo-router';
import { collection, doc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { auth, db } from '../../firebase/firebase';
import useGlobalStyles from '../../styles/global';


const initialLayout = { width: Dimensions.get("window").width };

const ActividadItem = ({ actividad, onPressCard, onCancel }) => {
  const styles = useGlobalStyles();

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{actividad.carModel || "Auto"}</Text>
        
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <TouchableOpacity onPress={() => onPressCard(actividad.id)} style={[styles.btn]}>
          <Text style={styles.btnText}>Ver</Text>
        </TouchableOpacity>
        {actividad.status === "pendiente" && (
          <TouchableOpacity onPress={() => onCancel(actividad.id)} style={[styles.btn, styles.btnDanger, { marginLeft: 8 }]}>
            <Text style={styles.btnText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default function SolicitudesClienteTabs() {
  const styles = useGlobalStyles();
  const router = useRouter();

  const [pendientes, setPendientes] = useState([]);
  const [aceptadas, setAceptadas] = useState([]);
  const [terminadas, setTerminadas] = useState([]);
  const [canceladas, setCanceladas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "pendientes", title: "Pendiente" },
    { key: "aceptadas" , title: "Aceptada" },
    { key: "terminadas", title: "Terminada" },
    { key: "canceladas", title: "Cancelad" },
  ]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setPendientes([]); setAceptadas([]); setTerminadas([]); setCanceladas([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "solicitudes"), where("clienteId", "==", uid), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPendientes(docs.filter((s) => s.status === "pendiente"));
        setAceptadas(docs.filter((s)  => s.status === "aceptada"));
        setTerminadas(docs.filter((s) => s.status === "terminada"));
        setCanceladas(docs.filter((s) => s.status === "cancelada"));
        setLoading(false);
      },
      (err) => {
        console.error("Error snapshot:", err);
        Alert.alert("Error", "No se pudieron cargar tus solicitudes.");
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const handleCancel = async (id) => {
    Alert.alert("Cancelar solicitud", "¿Estás segura de cancelar esta solicitud?", [
      { text: "No", style: "cancel" },
      {
        text: "Sí", style: "destructive",
        onPress: async () => {
          try {
            await updateDoc(doc(db, "solicitudes", id), {
              status: "cancelada",
              lavadorId: null,
              lavadorName: null,
              assigned: false,
            });
            Alert.alert("Cancelada", "La solicitud fue cancelada.");
          } catch (err) {
            console.error("Error cancelando:", err);
            Alert.alert("Error", "No se pudo cancelar. Intenta de nuevo.");
          }
        },
      },
    ]);
  };

  const handleGoToSolicitud = (id) => {
    router.push(`/cliente/solicituddetalle/${id}`);
  };

  const makeRoute = (data, emptyMsg) => () =>
    loading ? (
      <ActivityIndicator style={{ flex: 1 }} size="large" />
    ) : (
      <View style={styles.screen}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActividadItem actividad={item} onPressCard={handleGoToSolicitud} onCancel={handleCancel} />
        )}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={{ padding: 16 }}>{emptyMsg}</Text>}
      />
      </View>
    );

  const renderScene = SceneMap({
    pendientes: makeRoute(pendientes, "No hay solicitudes pendientes."),
    aceptadas: makeRoute(aceptadas, "No hay solicitudes aceptadas."),
    terminadas: makeRoute(terminadas, "No hay solicitudes terminadas."),
    canceladas: makeRoute(canceladas, "No hay solicitudes canceladas."),
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
          indicatorStyle={styles.tabIndicator}
          style={styles.tabBar}
          labelStyle={styles.tabLabel}
        />
      )}
    />
  );
}