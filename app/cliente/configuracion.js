// app/cliente/configuracion.js
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import useGlobalStyles from "../../styles/global";

export default function configuracion() {
  const styles = useGlobalStyles();
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={{ width: "100%", maxWidth: 720, alignSelf: "center" }}>
        <Text style={styles.h2}>Configuración</Text>
      </View>
    </View>
  );
}