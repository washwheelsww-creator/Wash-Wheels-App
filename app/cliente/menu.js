//app/cliente/menu.js
import { useRouter } from 'expo-router';
import { SafeAreaView, SectionList, Text, TouchableOpacity, View } from "react-native";
import useGlobalStyles from "../../styles/global";

const SECTIONS = [
  { title: 'Mi Cuenta',
    data: [ 
      { key: 'Perfil', screen: 'Perfil' },
      { key: 'Regalos', screen: 'Regalos' },
      { key: 'Noticias', screen: 'Noticias' }, ] },

  { title: 'Ayuda y Feedback',
    data: [ 
      { key: 'Preguntas Frecuentes', screen: 'FAQ' },
      { key: 'Encuesta', screen: 'Encuesta' }, ] },

  { title: 'Legal',
    data: [ 
      { key: 'Términos y Condiciones', screen: 'Legales' },
      { key: 'Privacidad', screen: 'Legales' }, ] },

  { title: 'Configuración',
    data: [
      { key: 'Ajustes', screen: 'Legales' }, 
      { key: 'Configuraciones', screen: 'Legales' }, ] }
];

export default function Menu() {
  const router = useRouter();
  const styles = useGlobalStyles();
  
  const safePush = (route) => {
  if (!route) return;
  router.push(typeof route === "string" ? (route.startsWith("/") ? route : `/${route}`) : String(route));
};

  const renderItem = ({ item }) => (
  <TouchableOpacity
    style={{ width: "100%", padding: 18 }}
    onPress={() => safePush(item.screen)}
  >
    <Text style={styles.text}>{String(item?.key ?? "")}</Text>
  </TouchableOpacity>
);

  return (
  <SafeAreaView style={styles.containerScroll}>
   <Text style={styles.title}>Wash Wheels</Text>
   <Text style={[styles.h2, { marginBottom: 12 }]}>Configuración</Text>

  <View style={{ width: "100%", maxWidth: 520 }}>
  <SectionList
 sections={SECTIONS}
  keyExtractor={(item, index) => String(item?.key ?? index)}
  renderSectionHeader={({ section: { title } }) => (
    <Text style={[styles.h2, { marginTop: 8 }]}>{String(title)}</Text>)}
  renderItem={renderItem}
  ItemSeparatorComponent={() => <View style={styles.separator} />}
  contentContainerStyle={{ paddingBottom: 24 }}
/> </View>

  <View style={{ width: "100%", maxWidth: 520, marginTop: 16 }}>
    <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => router.push("/")} >
     <Text style={styles.btnText}>Ir a Inicio</Text>
    </TouchableOpacity>
  </View>
  </SafeAreaView>
  );
}


