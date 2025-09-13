//C:\Users\User\App\wash-wheels-app\wash-wheels-app\app\menu.js
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

export default function Menu() {
  const { userProfile } = useAuth();
  const router = useRouter();
  const role = userProfile?.role;

  return (
    <View>
      <Text>Menú</Text>
      <TouchableOpacity onPress={() => router.push(`/${role}/perfil`)}>
        <Text>Perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push(`/${role}/regalos`)}>
        <Text>Regalos</Text>
      </TouchableOpacity>
      {/* Más opciones */}
    </View>
  );
}