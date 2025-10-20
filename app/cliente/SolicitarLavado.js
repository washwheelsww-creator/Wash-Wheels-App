// app/cliente/solicitarlavado.js
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref as firebaseRef, getDownloadURL, uploadBytes } from 'firebase/storage';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, KeyboardAvoidingView, Platform, Button as RNButton, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapViewBox from '../../components/MapViewBox';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../firebase/firebase';
import useGlobalStyles from '../../styles/global';
console.log('imported storage at module load:', !!storage);

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
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Debes permitir acceso a tus fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // <- usar el literal correcto y en array
      allowsEditing: true,
      quality: 0.7,
    });

    const didCancel = result?.canceled ?? result?.cancelled ?? false;
    const uri = result?.assets?.[0]?.uri ?? result?.uri ?? null;

    if (!didCancel && uri) {
      setImage(uri);
    }
  } catch (err) {
    console.error('pickImage error', err);
    Alert.alert('Error', 'No se pudo abrir la galería.');
  }
};

const uploadImageAndGetUrl = async (uri) => {
  console.log('uploadImageAndGetUrl invoked');
  console.log('received uri:', uri);

  if (!storage) {
  console.error('uploadImageAndGetUrl error: storage is undefined. Revisa la ruta de import y exports en firebase/firebase.js');
  // dump for debugging
  try { console.log('firebase module path check:', require.resolve('../../firebase/firebase')); } catch(e) { console.warn('require.resolve failed:', e.message); }
  throw new Error('Firebase storage no inicializado');
}
console.log('uploadImageAndGetUrl: storage ready. storage.app?.options.storageBucket:', storage?.app?.options?.storageBucket ?? null);

  // Información diagnóstica sobre la instancia storage
  try {
    console.log('storage type:', typeof storage);
    console.log('storage keys:', Object.keys(storage || {}));
    // intenta leer opciones si existen (puede variar según versión)
    console.log('storage.app?.options:', storage?.app?.options ?? null);
  } catch (err) {
    console.warn('No se pudo inspeccionar storage en detalle:', err);
  }

  try {
    console.log('uploadImageAndGetUrl starting for uri:', uri);

    const getBlob = (fileUri) =>
      new Promise((resolve, reject) => {
        console.log('XHR: iniciando petición GET para obtener blob desde uri:', fileUri);
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          console.log('XHR: onload, status:', xhr.status, 'responseType:', xhr.responseType);
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.error('XHR: onerror', e);
          reject(new Error('XHR failed to load blob: ' + JSON.stringify(e)));
        };
        xhr.responseType = 'blob';
        try {
          xhr.open('GET', fileUri, true);
          xhr.send(null);
        } catch (err) {
          console.error('XHR: excepción al abrir/enviar:', err);
          reject(err);
        }
      });

    const blob = await getBlob(uri);
    console.log('XHR: blob obtenido:', !!blob, { blobType: blob?.type, blobSize: blob?.size });

    if (!blob) {
      console.error('uploadImageAndGetUrl error: Blob vacío obtenido de la URI');
      throw new Error('Blob vacío obtenido de la URI');
    }

    const filename = `solicitudes/${Date.now()}-${Math.random().toString(36).slice(2,9)}.jpg`;
    console.log('Preparando upload. filename:', filename);

    // verificación antes de crear ref
    try {
      console.log('Verificando firebaseRef y storage antes de crear la referencia...');
      console.log('firebaseRef is function:', typeof firebaseRef === 'function');
      console.log('storage exists:', !!storage);
    } catch (e) {
      console.warn('Advertencia al verificar firebaseRef/storage:', e);
    }

    const sRef = firebaseRef(storage, filename);
    console.log('Referencia de storage creada:', !!sRef);

    const metadata = { contentType: blob.type || 'image/jpeg' };
    console.log('Metadata para upload:', metadata);

    console.log('Calling uploadBytes...');
    const uploadResult = await uploadBytes(sRef, blob, metadata);
    console.log('uploadBytes resolved. uploadResult:', uploadResult);

    try { blob.close && blob.close(); console.log('Blob cerrado si disponible'); } catch (e) { console.warn('No se pudo cerrar blob:', e); }

    console.log('Calling getDownloadURL...');
    const downloadUrl = await getDownloadURL(sRef);
    console.log('getDownloadURL resolved. downloadUrl:', downloadUrl);

    return downloadUrl;
  } catch (err) {
    console.error('uploadImageAndGetUrl error (caught):', err);
    console.error('err.name:', err?.name ?? null);
    console.error('err.message:', err?.message ?? String(err));
    console.error('err.code:', err?.code ?? null);
    console.error('err.stack:', err?.stack ?? null);
    console.error('err.serverResponse/customData:', err?.serverResponse ?? err?.customData ?? null);
    throw err;
  }
};

 const handleSubmit = async () => {
  console.log('handleSubmit - image state:', image);
  const imageUri = typeof image === 'string' ? image : image?.uri ?? null;
  console.log('handleSubmit - resolved imageUri:', imageUri);

  const coordsToSend = marker ? { latitude: marker.latitude, longitude: marker.longitude } : { latitude: region.latitude, longitude: region.longitude };
  const finalCarModel = marca === 'Otro' || modelo === 'Otro' ? customCarModel : `${marca} ${modelo}`;
  const finalColor = color === 'Otro' ? customColor : color;
  if (!finalCarModel || !finalColor) {
    Alert.alert('Error', 'Debes completar marca/modelo y color.');
    return;
  }

  setSubmitting(true);
  try {
    const photoURL = imageUri ? await uploadImageAndGetUrl(imageUri) : null;
    console.log('handleSubmit - photoURL result:', photoURL);

    await addDoc(collection(db, 'solicitudes'), {
      clientId: user.uid,
      clientName: user.displayName || user.email,
      carModel: finalCarModel,
      color: finalColor,
      serviceType,
      notes,
      coords: coordsToSend,
      status: 'pending',
      photoURL: photoURL || null,
      timestamp: serverTimestamp(),
    });
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
  } catch (err) {
    console.error('handleSubmit error:', err);
    Alert.alert('Error', err.message || 'No se pudo enviar la solicitud.');
  } finally {
    setSubmitting(false);
  }
};

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