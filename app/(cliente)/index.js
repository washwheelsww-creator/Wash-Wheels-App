//app/(cliente)/index.js
import styles from "../../styles/global";
import {Text,ScrollView, View, TouchableOpacity, SafeAreaView} from "react-native";
import { router } from 'expo-router';
function Index() {
const navigation = router();
  return (
  <SafeAreaView style={styles.container}> 
     <View style={styles.header}>
      <Text style={styles.title}>Wash Wheels</Text>
     </View>
   <ScrollView style={styles.containerScroll}>
    
     <Text> Bienvenido a home </Text>
     <TouchableOpacity style={styles.button} onPress={() => router.push('/prueba')}>
         <Text style={styles.buttonText}>Prueba</Text>
       </TouchableOpacity>
   </ScrollView>
  </SafeAreaView>
  );
}

export default Index;