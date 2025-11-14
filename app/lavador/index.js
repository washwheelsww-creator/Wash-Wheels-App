// app/lavador/index.js
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import useGlobalStyles from "../../styles/global";

// Firebase modular imports
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // ajusta la ruta si hace falta

export default function Index() {
  const styles = useGlobalStyles();
  const SOLICITUD_DE_PRUEBA = "hz3c2lK8giMUV51jgN23VJsBnBg2";

  const debugGetSolicitud = async (solicitudId = SOLICITUD_DE_PRUEBA) => {
    try {
      // obtiene el usuario directamente del SDK
      const auth = getAuth();
      const currentUser = auth.currentUser;

      console.log("DEBUG currentUser object:", currentUser ?? "null");
      console.log("DEBUG currentUser.uid:", currentUser?.uid ?? "null");

      if (!currentUser || !currentUser.uid) {
        Alert.alert("Debug", "No hay usuario autenticado. Inicia sesión y vuelve a intentarlo.");
        return;
      }

      console.log("DEBUG intentando getDoc para uid:", currentUser.uid, "solicitudId:", solicitudId);
      const docRef = doc(db, "solicitudes", solicitudId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        console.log("DEBUG solicitud data:", snap.data());
        Alert.alert("Debug GET", "Éxito: revisa la consola para ver datos.");
      } else {
        console.log("DEBUG solicitud no existe");
        Alert.alert("Debug GET", "La solicitud no existe (revisa el ID).");
      }
    } catch (err) {
      console.error("DEBUG getDoc error object:", err);
      console.error("DEBUG error.code:", err?.code);
      console.error("DEBUG error.message:", err?.message);
      const code = err?.code ?? "sin_codigo";
      const message = err?.message ?? JSON.stringify(err);
      Alert.alert("Debug getDoc error", `${code} - ${message}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wash Wheels</Text>
      </View>

      <ScrollView style={styles.containerScroll}>
        <Text> Bienvenido a home </Text>

        <TouchableOpacity
          onPress={() => debugGetSolicitud()}
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 999,
            backgroundColor: '#fff',
            padding: 8,
            borderRadius: 6,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '600' }}>DEBUG: getSolicitud</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}