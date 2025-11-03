// app/cliente/noticias.js
import { useRouter } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import useGlobalStyles from "../../styles/global";

const MOCK_NEWS = [
  { id: "n1", title: "Nuevas rutas", summary: "Hemos ampliado cobertura", date: "2025-10-01" },
  { id: "n2", title: "Promoción de invierno", summary: "Descuentos especiales", date: "2025-11-01" },
];

export default function Noticias() {
  const styles = useGlobalStyles();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", maxWidth: 720, alignSelf: "center" }}>
        <Text style={styles.h2}>Noticias</Text>

        <FlatList
          data={MOCK_NEWS}
          keyExtractor={(i) => i.id}
          style={{ marginTop: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => router.push(`/cliente/noticia/${item.id}`)}>
              <Text style={styles.cardTitle}>{String(item.title)}</Text>
              <Text style={styles.cardSub}>{String(item.summary)}</Text>
              <Text style={styles.muted}>{String(item.date)}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}