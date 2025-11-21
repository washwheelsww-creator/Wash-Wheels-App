// app/cliente/menu/legales.js
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import useGlobalStyles from "../../../styles/global";
export default function Legales() {
  const styles = useGlobalStyles();
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={{ width: "100%", maxWidth: 720, alignSelf: "center" }}>
     <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12 }}>
      <Text style={{ color: "#007AFF" }}>← Regresar</Text>
     </TouchableOpacity>
        <Text style={styles.h2}>Términos y Privacidad</Text>

        <ScrollView style={{ marginTop: 12, maxHeight: 500 }}>
          <Text style={styles.text}>
            Aquí van los Términos y Condiciones. Reemplaza este texto por la versión real de tu política. Asegúrate de incluir
            información sobre uso de datos, responsabilidades, contacto y enlaces a la política de privacidad completa.
          </Text>

          <Text style={[styles.h2, { marginTop: 16 }]}>Política de Privacidad</Text>
          <Text style={styles.text}>
            Aquí la política de privacidad. Informa qué datos recolectas, cómo los usas y quién tiene acceso.
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}