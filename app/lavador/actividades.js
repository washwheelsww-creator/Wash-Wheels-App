// app/lavador/actividades.js
import { useState } from "react";
import { Dimensions, FlatList, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import useGlobalStyles from "../../styles/global";

const initialLayout = { width: Dimensions.get("window").width };

const ActividadItem = ({ actividad }) => {
  const styles = useGlobalStyles();
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{actividad.titulo}</Text>
      <Text style={styles.textMuted}>Estado: {actividad.estado}</Text>
      <Text style={styles.textMuted}>Ubicación: {actividad.ubicacion}</Text>
    </View>
  );
};

// 🟢 Aceptadas: Mapa + Lista
const AceptadasRoute = () => {
  const styles = useGlobalStyles();
  const actividades = [
    {
      id: "1",
      titulo: "Lavado en casa",
      estado: "aceptada",
      ubicacion: "Av. Siempre Viva 123",
      coords: { latitude: 25.85, longitude: -97.5 },
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ height: 200 }}
        initialRegion={{
          latitude: 25.85,
          longitude: -97.5,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {actividades.map((a) => (
          <Marker key={a.id} coordinate={a.coords} title={a.titulo} />
        ))}
      </MapView>

      <FlatList
        data={actividades}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActividadItem actividad={item} />}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

// ✅ Terminadas
const TerminadasRoute = () => {
  const actividades = [
    { id: "2", titulo: "Lavado Deluxe", estado: "terminada", ubicacion: "Col. Centro" },
  ];
  return (
    <FlatList
      data={actividades}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ActividadItem actividad={item} />}
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

// ❌ Canceladas
const CanceladasRoute = () => {
  const actividades = [
    { id: "3", titulo: "Lavado rápido", estado: "cancelada", ubicacion: "Col. Juárez" },
  ];
  return (
    <FlatList
      data={actividades}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ActividadItem actividad={item} />}
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

export default function Actividades() {
  const styles = useGlobalStyles
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "aceptadas", title: "Aceptadas" },
    { key: "terminadas", title: "Terminadas" },
    { key: "canceladas", title: "Canceladas" },
  ]);

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
          labelStyle={  styles.Text }
        />
      )}
    />
  );
}