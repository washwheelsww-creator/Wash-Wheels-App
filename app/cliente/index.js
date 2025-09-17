//app/(cliente)/index.js
import useGlobalStyles from "../../styles/global";
import {Text,ScrollView, View, TouchableOpacity, SafeAreaView} from "react-native";
import { useRouter } from 'expo-router';
export default function Index() {
const router = useRouter();
 const styles = useGlobalStyles ();
return (
  <View style={styles.container}> 
     <View style={styles.header}>
      <Text style={styles.title}>Wash Wheels</Text>
     </View>
   <ScrollView style={styles.containerScroll}>
     <Text> Bienvenido a home </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/prueba')}>
         <Text style={styles.buttonText}>Prueba</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/perfil')}>
       <Text style={styles.buttonText}>Ir a mi perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/cliente/solicitarlavado')}>
       <Text style={styles.buttonText}>Solicitar Lavado</Text>
      </TouchableOpacity>
   </ScrollView>
  </View>
  );
}
