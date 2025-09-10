//Home.js
import styles from "../../styles/global";
import {Text,ScrollView, View, TouchableOpacity, SafeAreaView} from "react-native";
import { useNavigation } from "@react-navigation/native";

function HomeCliente() {
const navigation = useNavigation();
  return (
  <SafeAreaView style={styles.container}> 
     <View style={styles.header}>
      <Text style={styles.title}>Wash Wheels</Text>
     </View>
   <ScrollView style={styles.containerScroll}>
    
     <Text> Bienvenido a home </Text>
     <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Prueba')}>
         <Text style={styles.buttonText}>prueba</Text>
       </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Solicitud')}>
         <Text style={styles.buttonText}>Solicitud</Text>
       </TouchableOpacity>
   </ScrollView>
  </SafeAreaView>
  );
}

export default HomeCliente;