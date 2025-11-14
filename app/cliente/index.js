//app/cliente/index.js
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import useGlobalStyles from "../../styles/global";
export default function Index() {
const router = useRouter();
 const styles = useGlobalStyles ();
return (
  <View style={styles.containerCenter}> 
     <View style={styles.header}>
      <Text style={styles.title}>Wash Wheels</Text>
     </View>
   <ScrollView style={styles.containerScroll}>
     <Text> Bienvenido a home </Text>
      <TouchableOpacity style={styles.btn} onPress={() => router.push('/cliente/solicitarlavado')}>
       <Text style={styles.btnText}>Solicitar Lavado</Text>
      </TouchableOpacity>
   </ScrollView>
  </View>
  );
}
