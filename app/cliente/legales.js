// app/cliente/legales.js
import { ScrollView, Text, View } from "react-native";
import useGlobalStyles from "../../styles/global";

export default function Legales() {
  const styles = useGlobalStyles();

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", maxWidth: 720, alignSelf: "center" }}>
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