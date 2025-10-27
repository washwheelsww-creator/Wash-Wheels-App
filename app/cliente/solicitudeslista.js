import { useRouter } from 'expo-router';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../firebase/firebase';
import useGlobalStyles from '../../styles/global';

export default function SolicitudesLista() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const styles = useGlobalStyles ();
  const router = useRouter();

  useEffect(() => {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    setSolicitudes([]);
    setLoading(false);
    return;}

  const q = query( collection(db, 'solicitudes'), where('clientId', '==', uid), orderBy('timestamp', 'desc') );

  const unsub = onSnapshot(q, (snap) => {
   const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setSolicitudes(items);
    setLoading(false);
    setRefreshing(false);
   }, (err) => { console.error('Firestore onSnapshot error:', err);
    Alert.alert('Error', 'No se pudo cargar tus solicitudes.');
    setLoading(false);
    setRefreshing(false);
    });
    return () => unsub(); }, []);

  const onRefresh = useCallback(() => {
  setRefreshing(true);
  setTimeout(() => setRefreshing(false), 700); }, []);

  const handleCancel = async (id) => {
  Alert.alert('Cancelar solicitud', '¿Estás segura de cancelar esta solicitud?', [
    { text: 'No', style: 'cancel' },
    { text: 'Sí', style: 'destructive',
    onPress: async () => {
  try { await deleteDoc(doc(db, 'solicitudes', id));
  Alert.alert('Cancelada', 'La solicitud fue cancelada.');
  } catch (err) { console.error('Error cancelando solicitud:', err);
  Alert.alert('Error', 'No se pudo cancelar. Intenta de nuevo.');
   } } } ]); };

  const renderItem = ({ item }) => {
   const fecha = item.timestamp?.toDate ? item.timestamp.toDate().toLocaleString() : item.timestamp || '';  
   const statusText = String(item.status ?? "pendiente");
 return (
  <View style={styles.cardListItem} >
    <View style={styles.itemLeft}>
    <View style ={{marginRight:12}}>
    {item.photoURL ? ( <Image source={{ uri: item.photoURL }} style={styles.thumb} />
     ) : ( <View style={[styles.thumb, styles.noImage]}>
    <Text style={styles.textMuted}>Sin foto</Text>
    </View> )}
    </View>

  <View style={styles.itemMeta}>
   <Text style={styles.cardTitle}>{String(item.carModel ?? "Auto")}</Text>
   <Text style={styles.muted}>{fecha}</Text>
   <Text style={item.status === 'pendiente' ? styles.pendiente : item.status === 'aceptada' ? styles.aceptada : item.status === 'terminada' ? styles.terminada : styles.cancelada}>{statusText}</Text>
  </View>
  </View>

  <View style={styles.actionsColumn}>
  <TouchableOpacity style={[styles.btn, { marginTop: 8 }]} onPress={() => handleCancel(item.id)}>
   <Text style={styles.smallBtnText}>Cancelar</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.smallBtn} onPress={() => router.push(`/cliente/solicituddetalle/${String(item.id)}`)} activeOpacity={0.8} >
   <Text style={[styles.smallBtnText,{color:"#222"}]}>Ver</Text>
  </TouchableOpacity>

  
  </View>
  </View>
    );
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
  <View style={styles.container}>
  <View style={{ width: "100%", maxWidth: 720, alignSelf: "center" }}>
  {solicitudes.length === 0 ? (
    <View style={styles.containerCenter}>
      <Text style={styles.text}>No tienes solicitudes aún.</Text>
    </View> ) : (
  <FlatList data={solicitudes} keyExtractor={(i) => String(i.id)}
   renderItem={renderItem}
   refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
   ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
   contentContainerStyle={{ paddingBottom: 80 }} /> )}
  </View>
  </View>
  );
}
