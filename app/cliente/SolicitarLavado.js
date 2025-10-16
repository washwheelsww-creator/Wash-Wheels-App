// app/cliente/solicitarlavado.js
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref as storageRefFn, uploadBytes } from 'firebase/storage';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, KeyboardAvoidingView, Platform, Button as RNButton, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapViewBox from '../../components/MapViewBox';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../firebase/firebase';
import useGlobalStyles from '../../styles/global';

const marcasYModelos = {
 Toyota: ['Corolla', 'Camry', 'Yaris', 'Hilux'],
 Nissan: ['Sentra', 'Altima', 'Versa', 'X-Trail'],
 Ford: ['Fiesta', 'Focus', 'Explorer', 'Mustang'],
 Chevrolet: ['Aveo', 'Cruze', 'Spark', 'Trax'],
 Honda: ['Civic', 'Accord', 'Fit', 'CR-V'],
};
const colores = [ 'Blanco', 'Negro', 'Gris', 'Rojo', 'Azul', 'Verde', 'Amarillo', 'Plateado', 'Dorado',];
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZXppbmR1c3RyaWFsIiwiYSI6ImNtYWhiOHppMjAzbHIya3ExZ2kxbnZ3YTMifQ.TrxOg6CY4SF1b34CgydOYg'

export default function solicitarlavado() {
 const { user } = useAuth();
 const router = useRouter();
 const styles = useGlobalStyles();
 const colorScheme = useColorScheme()
 const isDark = colorScheme === 'dark'
 const bgStyle = {backgroundColor: isDark ? '#000000' : '#FFFFFF',}
 const txStyle = {color: isDark ? '#FFFFFF' : '#000000',}

 const [marca, setMarca] = useState('');
 const [modelo, setModelo] = useState('');
 const [customCarModel, setCustom] = useState('');
 const [color, setColor] = useState('');
 const [customColor, setCustomCol] = useState('');
 const [serviceType, setService] = useState('basico');
 const [notes, setNotes] = useState('');
 const [image, setImage] = useState(null);
 const [submitting, setSubmitting] = useState(false);

 const [region, setRegion] = useState({ latitude: 19.0, longitude: -98.2, latitudeDelta: 0.01, longitudeDelta: 0.01,});
 const [marker, setMarker] = useState(null)
 const [location, setLocation] = useState(null);


 useEffect(() => {
  (async () => {
   try {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
  Alert.alert('Permiso de ubicación denegado');
  return;
      }
  const loc = await Location.getCurrentPositionAsync({ accuracy: 5 });
  setLocation(loc.coords);
  const newRegion = { latitude: loc.coords.latitude, longitude: loc.coords.longitude,
   latitudeDelta: 0.01, longitudeDelta: 0.01,};
   setRegion(newRegion);
   setMarker({ latitude: newRegion.latitude, longitude: newRegion.longitude });
  } catch (err) {
   console.error('location error', err);
    }
  })();
}, []);

const goToCurrentLocation = async () => { try {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
   Alert.alert('Permiso de ubicación denegado');
    return; }
  const loc = await Location.getCurrentPositionAsync({ accuracy: 5 });
  const newRegion = {
  latitude: loc.coords.latitude, longitude: loc.coords.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01,};
  setRegion(newRegion);
  setMarker({ latitude: newRegion.latitude, longitude: newRegion.longitude });
   } catch (err) { console.error('goToCurrentLocation error', err);}};

 const pickImage = async () => {
 const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') { Alert.alert('Permiso requerido', 'Debes permitir acceso a tus fotos.');
  return;}
  const result = await ImagePicker.launchImageLibraryAsync({mediaTypes: ImagePicker.MediaTypeOptions.Images,allowsEditing: true, quality: 0.7,});
  if (!result.canceled) {
   setImage(result.assets[0].uri);}};
const uploadImageAndGetUrl = async (uri) => {
  if (!uri) return null;
  try {
    console.log('uploadImageAndGetUrl starting for uri:', uri);

    const getBlob = (fileUri) =>
      new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () { resolve(xhr.response); };
        xhr.onerror = function (e) { reject(new Error('XHR failed to load blob: ' + JSON.stringify(e))); };
        xhr.responseType = 'blob';
        xhr.open('GET', fileUri, true);
        xhr.send(null);
      });

    const blob = await getBlob(uri);
    if (!blob) throw new Error('Blob vacío obtenido de la URI');
    console.log('blob type/size:', blob.type, blob.size);

    const filename = `solicitudes/${Date.now()}.jpg`;
    const storageRef = storageRefFn(storage, filename);
    const metadata = { contentType: blob.type || 'image/jpeg' };

    console.log('Uploading to storage path:', filename);
    await uploadBytes(storageRef, blob, metadata);

    try { blob.close && blob.close(); } catch (e) {}

    const url = await getDownloadURL(storageRef);
    console.log('Upload successful, downloadURL:', url);
    return url;
  } catch (err) {
    console.error('uploadImageAndGetUrl error:', err);
    console.error('Firebase upload error code:', err.code || null);
    console.error('Firebase upload error message:', err.message || String(err));
    console.error('Firebase upload error customData:', err.customData || err.serverResponse || null);
    throw err;
  }
};

  const handleSubmit = async () => {
   const coordsToSend = marker ? { latitude: marker.latitude, longitude: marker.longitude } : { latitude: region.latitude, longitude: region.longitude };
   const finalCarModel = marca === 'Otro' || modelo === 'Otro' ? customCarModel : `${marca} ${modelo}`;
   const finalColor = color === 'Otro' ? customColor : color;
   if (!finalCarModel || !finalColor) {
    Alert.alert('Error', 'Debes completar marca/modelo y color.');
   return;}

  setSubmitting(true);
  try { const photoURL = await uploadImageAndGetUrl(image);
  await addDoc(collection(db, 'solicitudes'), {
    clientId: user.uid,
    clientName: user.displayName || user.email,
    carModel: finalCarModel,        
    color: finalColor,
    serviceType,
    notes,
    coords: { latitude: region.latitude, longitude: region.longitude },
    status: 'pending',
    photoURL,
    timestamp: serverTimestamp(),});

    Alert.alert('¡Solicitud enviada!', 'Revisa tu sección de “Mis solicitudes”.');
    setMarca('');
    setModelo('');
    setCustom('');
    setColor('');
    setCustomCol('');
    setService('basico');
    setNotes('');
    setImage(null);
    router.replace('/cliente');
  } catch (err) { console.error(err);
      Alert.alert('Error', err.message || 'No se pudo enviar la solicitud.');
  } finally { setSubmitting(false); }};

 const onMarkerDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    setRegion((r) => ({ ...r, latitude, longitude }));
  };
  
  const renderHeader = useCallback(() => {
  return(
<View style={[ bgStyle]}>
   <Text style={[styles.heading, txStyle]}>Rellenar datos</Text>
<Text style={[styles.label, txStyle]}>Marca</Text>
<Picker
  selectedValue={marca ?? ''}
  onValueChange={(v) => {
  setMarca(v ?? '');
  setModelo('');
  setCustom('');
  }}>
  <Picker.Item label="--Selecciona marca--" value="" />
  {Object.keys(marcasYModelos || {}).map((m) => (
    <Picker.Item key={m} label={m} value={m} />))}
  <Picker.Item label="Otro" value="Otro" />
</Picker>

{marca !== '' && Array.isArray(marcasYModelos[marca]) && (<>
  <Text style={[styles.label, txStyle]}>Modelo</Text>
  <Picker
  selectedValue={modelo ?? ''}
  onValueChange={(v) => {
  setModelo(v ?? '');
  if (v !== 'Otro') setCustom(''); }} >
  <Picker.Item label="--Selecciona modelo--" value="" />
  {(marcasYModelos[marca] || []).map((mod) => (
   <Picker.Item key={mod} label={mod} value={mod} />))}
  <Picker.Item label="Otro" value="Otro" />
  </Picker>
  </>
)}

{(marca === 'Otro' || modelo === 'Otro') && (
  <TextInput style={styles.input} placeholder="Especifica marca y modelo" value={customCarModel} onChangeText={(t) => setCustom(t ?? '')} />)}

<Text style={[styles.label, txStyle]}>Color</Text>
<Picker selectedValue={color ?? ''} onValueChange={(v) => setColor(v ?? '')}>
  <Picker.Item label="--Selecciona color--" value="" />
  {(colores || []).map((c) => (
  <Picker.Item key={c} label={c} value={c} /> ))}
  <Picker.Item label="Otro" value="Otro" />
</Picker>

{color === 'Otro' && (
  <TextInput style={styles.input} placeholder="Color personalizado" value={customColor} onChangeText={(t) => setCustomCol(t ?? '')} />)}

<Text style={[styles.label, txStyle]}>Tipo de servicio</Text>
<Picker selectedValue={serviceType ?? ''} onValueChange={(v) => setService(v ?? '')}>
  <Picker.Item label="Básico" value="basico" />
  <Picker.Item label="Premium" value="premium" />
  <Picker.Item label="Deluxe" value="deluxe" />
</Picker>

<Text style={[styles.label, txStyle]}>Detalles adicionales</Text>
  <TextInput style={[styles.input, { height: 30 }]} multiline placeholder="Ej. zona de acceso, llaves…" value={notes} onChangeText={setNotes} />
  <RNButton title="Seleccionar foto" onPress={pickImage} />
  {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginVertical: 10 }} />}
  </View>
 );},
 [ marca, modelo, customCarModel, color, customColor, serviceType, marker, ],);

  const renderFooter = () => (
  <View style={{ paddingHorizontal: 18, paddingTop: 12, paddingBottom: 24 }}>
  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 }}>  
    <TouchableOpacity onPress={goToCurrentLocation} style={styles.currentLocButton}>
    <Text style={styles.locationText}>📍</Text>
    </TouchableOpacity>
  </View>

  <View style={{ width: '100%', height: 300, borderRadius: 8, overflow: 'hidden' }}>
    <MapViewBox region={region} marker={marker} onMarkerDragEnd={onMarkerDragEnd} onRegionChangeComplete={setRegion} goToCurrentLocation={goToCurrentLocation}/>
  </View>

  <View style={{ marginTop: 12 }}>
    {submitting ? ( <ActivityIndicator style={{ margin: 16 }} /> ) : (
    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
      <Text style={styles.buttonText}>Enviar solicitud</Text>
    </TouchableOpacity>)}
  </View>
  </View>
);

if (!location) {
  return <ActivityIndicator style={{ flex: 1 }} size="large" />; }
  
return (
 <SafeAreaView style={{ flex: 1 }}>
 <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
 <FlatList style={{ flex: 1 }} data={[]}
  ListHeaderComponent={renderHeader}
  ListFooterComponent={renderFooter}
  contentContainerStyle={[styles.containerScroll, bgStyle, { paddingBottom: 220 }]}
  keyboardShouldPersistTaps="always"
  keyboardDismissMode="none"
  nestedScrollEnabled
  removeClippedSubviews={false}/>
 </KeyboardAvoidingView>
 </SafeAreaView>
);}