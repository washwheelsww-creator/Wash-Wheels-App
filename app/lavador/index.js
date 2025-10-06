//app/lavador/index.js
import { ScrollView, Text, View } from "react-native";
import useGlobalStyles from "../../styles/global";
export default function Index() {
const styles = useGlobalStyles();
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
