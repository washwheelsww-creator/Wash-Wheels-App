// app/cliente/faq.js
import { useRouter } from "expo-router";
import { SectionList, Text, TouchableOpacity, View } from "react-native";
import useGlobalStyles from "../../styles/global";
const FAQ_DATA = [
  { title: "Pagos", data: ["¿Cómo pago? Usamos tarjeta y efectivo.", "¿Se guarda mi tarjeta? No directamente."] },
  { title: "Reservas", data: ["¿Puedo cancelar? Sí antes de 2 horas.", "¿Puedo reagendar? Sí."] },
];

export default function FAQ() {
  const styles = useGlobalStyles();
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={{ width: "100%", maxWidth: 720, alignSelf: "center" }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12 }}>
        <Text style={{ color: "#007AFF" }}>← Regresar</Text>
        </TouchableOpacity>
        <Text style={styles.h2}>Preguntas Frecuentes</Text>

        <SectionList
          sections={FAQ_DATA}
          keyExtractor={(item, idx) => String(idx)}
          renderSectionHeader={({ section: { title } }) => <Text style={[styles.h2, { marginTop: 12 }]}>{String(title)}</Text>}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 8 }}>
              <Text style={styles.text}>{String(item)}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}