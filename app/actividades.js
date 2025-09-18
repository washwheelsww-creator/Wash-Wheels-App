//sisisi.js
import useGlobalStyles from "../styles/global";
import { View, Text, } from "react-native";
export default function Actividades() {
  const styles = useGlobalStyles();
   return (  
   <View style={styles.container}>
     <Text style={styles.welcome}>Wash Wheels</Text>
     <Text> actividades </Text>
   </View>
    
  );
}