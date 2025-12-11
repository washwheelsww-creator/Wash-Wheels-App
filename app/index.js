// app/index.js
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import useGlobalstyles from "../styles/global";

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const styles = useGlobalstyles();
  if (loading) return null;          // evita parpadeos
 const handleCliente = () => router.replace('/cliente');
 const handleLavador  = () => router.replace('/lavador');

  console.log("se inicio");
  return (
    
  <View style={styles.containerCenter}>
   <Text style={styles.title}>Wash Wheels</Text>
   
    <TouchableOpacity style={styles.btn} onPress={handleCliente}>
      <Text style={styles.btnText}>Solicitar Lavado</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.btn} onPress={handleLavador}>
      <Text style={styles.btnText}>  Ser Lavador      </Text>
    </TouchableOpacity>
  </View>

  );
}