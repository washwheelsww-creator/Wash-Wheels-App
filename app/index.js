// app/index.js
import { useRouter } from 'expo-router';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import useGlobalstyles from "../styles/global";

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const styles = useGlobalstyles();
  if (loading) return null;          // evita parpadeos
  
const handleCliente = () => {
  if (!user) {
    router.push({ pathname: '/login', params: { role: 'cliente' } });
  } else {
    // Navega a la pantalla de Solicitar Lavado
    router.replace('/cliente/solicitarlavado');
  }
};

const handleLavador = () => {
  if (!user) {
    router.push({ pathname: '/login', params: { role: 'lavador' } });
  } else if (user.role === 'lavador' || user.role === 'admin') {
    // Manda a la ruta raíz del drawer de lavador
    router.replace('/lavador');
  } else {
    Alert.alert('Acceso denegado', 'No tienes permisos para ser lavador');
  }
};

  return (
  <View style={styles.container}>
   <Text style={styles.title}>Wash Wheels</Text>
    <TouchableOpacity style={styles.button} onPress={handleCliente}>
      <Text style={styles.buttonText}>Solicitar Lavadox</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={handleLavador}>
      <Text style={styles.buttonText}>  Ser Lavador     </Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => router.push('/cliente/prueba')}>
         <Text style={styles.buttonText}>Prueba</Text>
      </TouchableOpacity>
  </View>

  );
}