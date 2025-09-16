//app/lavador/index.js
import styles from "../../styles/global";
import {Text,ScrollView, View, TouchableOpacity, SafeAreaView} from "react-native";
import { useRouter } from 'expo-router';
export default function Index() {
const router = useRouter();
  return (
  <View style={styles.container}> 
     <View style={styles.header}>
      <Text style={styles.title}>Wash Wheels</Text>
     </View>
   <ScrollView style={styles.containerScroll}>
    
     <Text> Bienvenido a home </Text>
   </ScrollView>
  </View>
  );
}
