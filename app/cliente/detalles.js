import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebase/firebase';

export default function Detalles() {
  const { id } = useSearchParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
 const router = useRouter();
  useEffect(() => {
  let mounted = true;
  (async () => {
  try {
    const snap = await getDoc(doc(db, 'solicitudes', id));
    if (mounted) setItem({ id: snap.id, ...snap.data() });
  } catch (err) {
    console.error(err);
    Alert.alert('Error', 'No se pudo cargar la solicitud.');
  } finally {
    if (mounted) setLoading(false);
    }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (!item) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>No encontrada</Text></View>;

  const fecha = item.timestamp?.toDate ? item.timestamp.toDate().toLocaleString() : item.timestamp;
  return (
  <ScrollView contentContainerStyle={{ padding: 16 }}>
  {item.photoURL && <Image source={{ uri: item.photoURL }} style={{ width: '100%', height: 240, borderRadius: 8 }} />}
    <Text style={{ marginTop: 12, fontWeight: '700' }}>{item.carModel}</Text>
    <Text style={{ color: '#666', marginTop: 4 }}>{fecha}</Text>
    <Text style={{ marginTop: 12 }}>Color: {item.color}</Text>
    <Text style={{ marginTop: 8 }}>Tipo: {item.serviceType}</Text>
    <Text style={{ marginTop: 8 }}>Notas: {item.notes || '-'}</Text>
    <Text style={{ marginTop: 8 }}>Estado: {item.status}</Text>

  <TouchableOpacity style={{ marginTop: 18, backgroundColor: '#e74c3c', padding: 12, borderRadius: 8 }} onPress={async () => {
  try {
    await updateDoc(doc(db, 'solicitudes', id), { status: 'cancelled' });
    Alert.alert('Hecho', 'Solicitud cancelada.');
    navigation.goBack();
    } catch (err) {
    console.error(err);
    Alert.alert('Error', 'No se pudo cancelar.');
    } }}>
    <Text style={{ color: '#fff', textAlign: 'center' }}>Cancelar solicitud</Text>
  </TouchableOpacity>
    </ScrollView>
  );
}