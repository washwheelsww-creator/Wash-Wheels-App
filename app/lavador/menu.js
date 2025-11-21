// app/lavador/menu.js
import { useRouter } from "expo-router";
import { SectionList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import useGlobalStyles from "../../styles/global";

const SECTIONS = [
  { title: "Mi Cuenta", data: [{ key: "Perfil", screen: "/lavador/menu/perfil_lav" }, { key: "Regalos", screen: "/lavador/menu/regalos_lav" }, { key: "Noticias", screen: "/lavador/menu/noticias_lav" }]},
  { title: "Ayuda y Feedback", data: [{ key: "Preguntas Frecuentes", screen: "/lavador/menu/faq_lav" }, { key: "Encuesta", screen: "/lavador/menu/encuesta_lav" }]},
  { title: "Legal", data: [{ key: "Términos y Condiciones", screen: "/lavador/menu/legales_lav" }, { key: "Privacidad", screen: "/lavador/menu/legales_lav" }]},
  { title: "Configuración", data: [{ key: "Ajustes", screen: "/lavador/menu/ajustes_lav" }, { key: "Configuraciones", screen: "/lavador/menu/configuraciones_lav" }]},
];

export default function Menu() {
  const router = useRouter();
  const styles = useGlobalStyles();
  const insets = useSafeAreaInsets();

  const safePush = (route) => {
    if (!route) return;
    const normalized = typeof route === "string" ? route.trim() : String(route);
    router.push(normalized.startsWith("/") ? normalized : `/${normalized}`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={{ width: "100%", paddingVertical: 14, paddingHorizontal: 12 }} onPress={() => safePush(item.screen)} activeOpacity={0.7}>
      <Text style={styles.text}>{String(item?.key ?? "")}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={{ width: "100%", maxWidth: 920, alignSelf: "center", flex: 1, paddingHorizontal: 12 }}>
        <Text style={styles.title}>Wash Wheels</Text>
        <Text style={[styles.h2, { marginBottom: 12 }]}>Configuración</Text>

        <SectionList
          sections={SECTIONS}
          keyExtractor={(item, index) => String(item?.key ?? index)}
          renderSectionHeader={({ section: { title } }) => <Text style={[styles.h2, { marginTop: 8 }]}>{String(title)}</Text>}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingBottom: 28 + insets.bottom }}
          style={{ flex: 1 }}
        />
      </View>
      
      <View pointerEvents="box-none" style={{ position: "absolute", left: 0, right: 0, bottom: insets.bottom + 12, alignItems: "center" }}>
        <View style={{ width: "100%", maxWidth: 920, paddingHorizontal: 12 }}>
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => router.push("/")}>
            <Text style={styles.btnText}>Ir a Inicio</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}