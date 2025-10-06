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

  return (
  <View style={styles.container}>
   <Text style={styles.title}>Wash Wheels</Text>
   
    <TouchableOpacity style={styles.button} onPress={handleCliente}>
      <Text style={styles.buttonText}>Solicitar Lavadox</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={handleLavador}>
      <Text style={styles.buttonText}>  Ser Lavador     </Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => router.push('/cliente')}>
      <Text style={styles.buttonText}>  Ser Lavaaador     </Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => router.push('/perfil')}>
         <Text style={styles.buttonText}>Prueba</Text>
      </TouchableOpacity>
  </View>

  );
}