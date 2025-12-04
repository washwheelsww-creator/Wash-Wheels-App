// app/lavador/menu/regalos.js
import { useRouter } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import useGlobalStyles from "../../../styles/global";

const MOCK = [
  { id: "r1", title: "10% de descuento", code: "DESCUENTO10", desc: "Válido 30 días" },
  { id: "r2", title: "Lava gratis", code: "LAVAGRATIS", desc: "Aplica en lavado básico" },
];

export default function Regalos() {
  const styles = useGlobalStyles();
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={{ width: "100%", maxWidth: 720, alignSelf: "center" }}>
    <TouchableOpacity onPress={() => router.replace("/lavador/menu")} style={{ marginBottom: 12 }}>
            <Text style={{ color: "#007AFF" }}>← Regresar</Text>
          </TouchableOpacity>
        <Text style={styles.h2}>Regalos y Promociones</Text>

        <FlatList
          data={MOCK}
          keyExtractor={(i) => i.id}
          style={{ marginTop: 12 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{String(item.title)}</Text>
              <Text style={styles.gray}>{String(item.desc)}</Text>
              <View style={{ marginTop: 8 }}>
                <TouchableOpacity style={[styles.smallBtn, { backgroundColor: styles.btnPrimary ? undefined : undefined }]}>
                  <Text style={styles.smallBtnText}>{String(item.code)}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}