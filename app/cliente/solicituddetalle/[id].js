import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../../firebase/firebase';
import useGlobalStyles from '../../../styles/global';
console.log('useSearchParams type:', typeof useSearchParams);
console.log('useRouter type:', typeof useRouter);

export default function SolicitudDetalle() {
  const params = useLocalSearchParams();
  const { id } = params ?? {};
  const router = useRouter();
  const styles = useGlobalStyles();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
console.log('useSearchParams returned id:', id);
console.log('router type:', typeof router, 'router.push exists:', !!router?.push);
  useEffect(() => {
    console.log('SolicitudDetalle mount -> id:', id, 'dbDefined:', !!db);

    if (!id) {
      Alert.alert('Error', 'ID de solicitud no provisto.');
      router.back();
      return;
    }

    let mounted = true;
    (async () => {
      try {
        if (!db) throw new Error('Firestore "db" no está definido');

        const safeId = String(id);
        const docRef = doc(db, 'solicitudes', safeId);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
          console.warn('Solicitud no encontrada en Firestore, id:', safeId);
          if (mounted) setItem(null);
          Alert.alert('No encontrada', 'La solicitud no existe o fue eliminada.');
          router.back();
          return;
        }

        if (mounted) setItem({ id: snap.id, ...snap.data() });
      } catch (err) {
        console.error('Error cargando solicitud:', err);
        Alert.alert('Error', 'No se pudo cargar la solicitud.');
        router.back();
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, router]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  if (!item)
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>No se pudo cargar la solicitud.</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 12, padding: 10, backgroundColor: '#274bb1', borderRadius: 6 }}
        >
          <Text style={{ color: '#fff' }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );

  const fecha = item.timestamp?.toDate ? item.timestamp.toDate().toLocaleString() : item.timestamp;

  return (
  <SafeAreaView style={styles.container}>
    <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12 }}>
        <Text style={{ color: "#007AFF" }}>← Regresar</Text>
      </TouchableOpacity>
   <ScrollView contentContainerStyle={styles.containerScroll}>
    {item.photoURL && <Image source={{ uri: item.photoURL }} style={styles.image} />}
  <Text style={[styles.h2 ,{ marginTop: 12}]}> {item.carModel || 'Auto'}</Text>
  <Text style={[styles.textMuted,{marginTop: 4 }]}>{fecha}</Text>
  <Text style={[styles.text,{ marginTop: 12}]}>Color: {item.color || '-'}</Text>
  <Text style={[styles.text,{ marginTop: 8}]}>Tipo: {item.serviceType || '-'}</Text>
  <Text style={[styles.text,{ marginTop: 8}]}>Notas: {item.notes || '-'}</Text>
  <Text style={[styles.text,{ marginTop: 8}]}>Estado: {item.status || '-'}</Text>
    <TouchableOpacity style={[styles.btnDanger, { marginTop: 18, width:'170'}]} onPress={async () => {
   try {
  if (!db) throw new Error('Firestore "db" no está definido');
  await updateDoc(doc(db, 'solicitudes', String(id)), { status: 'cancelled' });
  Alert.alert('Hecho', 'Solicitud cancelada.');
  router.back();
  } catch (err) {
  console.error('Error cancelando:', err);
  Alert.alert('Error', 'No se pudo cancelar la solicitud.');
  } }} >
  <Text style={styles.btnText}>Cancelar solicitud</Text>
    </TouchableOpacity>
   </ScrollView>
  </SafeAreaView>
  );
}