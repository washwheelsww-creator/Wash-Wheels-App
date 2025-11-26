// app/cliente/menu/configuracion.js
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import useGlobalStyles from "../../../styles/global";

export default function configuracion() {
  const styles = useGlobalStyles();
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.replace("/cliente/menu")} style={{ marginBottom: 12 }}>
              <Text style={{ color: "#007AFF" }}>← Regresar</Text>
            </TouchableOpacity>
      <View style={{ width: "100%", maxWidth: 720, alignSelf: "center" }}>
        <Text style={styles.h2}>Configuración</Text>
      </View>
    </View>
  );
}