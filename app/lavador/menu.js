//app/cliente/menu.js
import { useRouter } from 'expo-router';
import { SectionList, Text, TouchableOpacity, View } from "react-native";
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
  const router = useRouter()
  const styles = useGlobalStyles();

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => router.push(item.screen)}>
      <Text style={styles.itemText}>{item.key}</Text>
    </TouchableOpacity>);

  return (
  <View style={styles.container}>
    <Text style={styles.title}>Wash Wheels</Text> 
    <Text style={styles.welcome}>Configuración</Text>
   
    <SectionList sections={SECTIONS} keyExtractor={(item) => item.key} 
      renderSectionHeader={({ section: { title } }) => (
    <Text style={styles.cuadra}>{title}</Text>)} renderItem={renderItem} 
      ItemSeparatorComponent={() => 
    <View style={styles.separator} />} />
    <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
      <Text style={styles.buttonText}>Ir a Inicio</Text>
    </TouchableOpacity>
  </View>
  );
}