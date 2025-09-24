// app/cliente/solicitarlavado.js
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Platform, Button as RNButton, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import BackButton from '../../components/BackButton';
import MapViewBox from '../../components/MapViewBox';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../firebase/firebase';
import useGlobalStyles from '../../styles/global';
import firebaseApp from './src/firebase/firebaseConfig'; // <-- tu config

const marcasYModelos = {
 Toyota: ['Corolla', 'Camry', 'Yaris', 'Hilux'],
 Nissan: ['Sentra', 'Altima', 'Versa', 'X-Trail'],
 Ford: ['Fiesta', 'Focus', 'Explorer', 'Mustang'],
 Chevrolet: ['Aveo', 'Cruze', 'Spark', 'Trax'],
 Honda: ['Civic', 'Accord', 'Fit', 'CR-V'],
};
const colores = [ 'Blanco', 'Negro', 'Gris', 'Rojo', 'Azul', 'Verde', 'Amarillo', 'Plateado', 'Dorado',];
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZXppbmR1c3RyaWFsIiwiYSI6ImNtYWhiOHppMjAzbHIya3ExZ2kxbnZ3YTMifQ.TrxOg6CY4SF1b34CgydOYg'
export default function SolicitarLavado() {
 const { user } = useAuth();
 const router = useRouter();
 const [marca, setMarca] = useState('');
 const [modelo, setModelo] = useState('');
 const [customCarModel, setCustom] = useState('');
 const [color, setColor] = useState('');
 const [customColor, setCustomCol] = useState('');
 const [serviceType, setService] = useState('basico');
 const [date, setDate] = useState(new Date());
 const [showPicker, setShowPicker] = useState(false);
 const [notes, setNotes] = useState('');
 const [submitting, setSubmitting] = useState(false); 
 const styles = useGlobalStyles();
 const colorScheme = useColorScheme()
 const isDark = colorScheme === 'dark'
 const backgroundStyle = {backgroundColor: isDark ? '#000000' : '#FFFFFF',}
 const textStyle = {color: isDark ? '#FFFFFF' : '#000000',}
 const [locationData, setLocationData] = useState(null)
 const [query, setQuery]         = useState('')
 const [suggestions, setSuggestions] = useState([])
 const [region, setRegion]       = useState({ latitude:19, longitude:-98 })
 const [marker, setMarker]       = useState(null)
 const [location, setLocation] = useState(null);
 const [image, setImage] = useState(null);
 const loadSuggestions = useCallback(
  debounce(async text => {
  if (!text) return setSuggestions([])
 const data = await fetchSuggestions(text)
  setSuggestions(data)}, 300),[])
 const onSelect = item => {
  setRegion({ latitude: item.latitude, longitude: item.longitude })
  setMarker({ latitude: item.latitude, longitude: item.longitude })
  setQuery(item.title)
  setSuggestions([]) }

  useEffect(() => {
   (async () => { const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso de ubicación denegado');
   return;}
  const loc = await Location.getCurrentPositionAsync({ accuracy: 5 });
  setLocation(loc.coords);
  setRegion((r) => ({
  ...r,
  latitude: loc.coords.latitude,
  longitude: loc.coords.longitude,
  }));
  })();
  }, []);

 const goToCurrentLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
   Alert.alert('Permiso de ubicación denegado');
    return; }
 const loc = await Location.getCurrentPositionAsync({ accuracy: 5 });
  setRegion((r) => ({
    ...r,
    latitude: loc.coords.latitude,
    longitude: loc.coords.longitude,
  })); };
 const onMarkerDragEnd = (e) => {
 const { latitude, longitude } = e.nativeEvent.coordinate; setRegion({ ...region, latitude, longitude });};
 const finalCarModel =
  marca === 'Otro' || modelo === 'Otro'
  ? customCarModel
  : `${marca} ${modelo}`;
 const finalColor = color === 'Otro' ? customColor : color;
 const uriToBlob = (uri) =>
  new Promise((resolve, reject) => {
  
  const xhr = new XMLHttpRequest();
   xhr.onload = () => resolve(xhr.response);
  xhr.onerror = () => reject(new TypeError('Network request failed'));
  xhr.responseType = 'blob';
  xhr.open('GET', uri, true);
  xhr.send(null); });

 const pickImage = async () => {
 const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
   Alert.alert('Permiso requerido', 'Debes permitir acceso a tus fotos.');
  return;}
  const result = await ImagePicker.launchImageLibraryAsync({
   mediaTypes: ImagePicker.MediaTypeOptions.Images,
   allowsEditing: true,
   quality: 0.7,});
  if (!result.canceled) {
   setImage(result.assets[0].uri);}};
  const handleSearch = async (text) => {
    setQuery(text)
    if (text.length < 3) {
      setResults([])
      return
    }
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          text
        )}.json?access_token=${MAPBOX_TOKEN}`
      )
      const json = await res.json()
      setResults(json.features || [])
    } catch (err) {
      console.error(err)
    }
  }
  const selectPlace = (item) => {
    setCenter({ lat: item.center[1], lng: item.center[0] })
    setQuery(item.place_name)
    setResults([])
  }

  const handleSubmit = async () => {
    console.log('Enviar solicitud con:', locationData)
    if (!finalCarModel || !finalColor) {
      Alert.alert('Error', 'Debes completar marca/modelo y color.');
      return;}
    setSubmitting(true);
    try { let photoURL = null;
      if (image) {
    const blob = await uriToBlob(image);
    const filename = `solicitudes/${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, blob);
    photoURL = await getDownloadURL(storageRef);}
    await addDoc(collection(db, 'solicitudes'), {
    clientId: user.uid,
    clientName: user.displayName || user.email,
    carModel: finalCarModel,
    color: finalColor,
    serviceType,
    preferredAt: date,
    notes,
    coords: { latitude: region.latitude, longitude: region.longitude },
    status: 'pending',
    photoURL,
    timestamp: serverTimestamp(),
      });

      Alert.alert('¡Solicitud enviada!', 'Revisa tu sección de “Mis solicitudes”.');
      setMarca('');
      setModelo('');
      setCustom('');
      setColor('');
      setCustomCol('');
      setService('basico');
      setDate(new Date());
      setNotes('');
      setImage(null);

      router.replace('/cliente');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message || 'No se pudo enviar la solicitud.');
    } finally {
      setSubmitting(false);
    } };

  if (!location) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />; }
 console.log('Firebase initialized?', firebaseApp.name)

return (
<ScrollView style={[styles.scrollView, backgroundStyle]} contentContainerStyle={styles.containerScroll}>
  <View style={[styles.header, textStyle]}>
   <BackButton />
   <Text style={[styles.heading, textStyle]}>Solicitar Lavado</Text>
  </View>
   <Text style={[styles.label, textStyle]}>Marca</Text>
  <Picker selectedValue={marca}onValueChange={(v) => {
    setMarca(v);
    setModelo('');
    setCustom('');}}>
  <Picker.Item label="--Selecciona marca--" value="" />
    {Object.keys(marcasYModelos).map((m) => (
    <Picker.Item key={m} label={m} value={m} /> ))}
    <Picker.Item label="Otro" value="Otro" />  
    </Picker>
  {marca !== '' && (
    <>
  <Text style={[styles.label, textStyle]}>Modelo</Text>
  <Picker selectedValue={modelo} onValueChange={(v) => {
   setModelo(v);
   if (v !== 'Otro') setCustom('');}} >
    <Picker.Item label="--Selecciona modelo--" value="" />
    {marcasYModelos[marca]?.map((mod) => (
    <Picker.Item key={mod} label={mod} value={mod} />))}
    <Picker.Item label="Otro" value="Otro" />
  </Picker>
   </>)}
      {(marca === 'Otro' || modelo === 'Otro') && (
    <TextInput style={styles.input} placeholder="Especifica marca y modelo" value={customCarModel} onChangeText={setCustom}
      />)}

  <Text style={[styles.label, textStyle]}>Color</Text>
  <Picker selectedValue={color} onValueChange={setColor} >
   <Picker.Item label="--Selecciona color--" value="" />
   {colores.map((c) => (
   <Picker.Item key={c} label={c} value={c} />))}
   <Picker.Item label="Otro" value="Otro" />
  </Picker>
      {color === 'Otro' && (
 <TextInput style={styles.input} placeholder="Color personalizado" value={customColor} onChangeText={setCustomCol}/> )}
   <Text style={[styles.label, textStyle]}>Tipo de servicio</Text>
  <Picker
   selectedValue={serviceType}
   onValueChange={setService}>
  <Picker.Item label="Básico" value="basico" />
  <Picker.Item label="Premium" value="premium" />
  <Picker.Item label="Deluxe" value="deluxe" />
 </Picker>
    <Text style={[styles.label, textStyle]}>Fecha preferida</Text>
  <RNButton title={date.toLocaleString()} onPress={() => setShowPicker(true)}/>
  {showPicker && (<DateTimePicker value={date} mode="datetime" display={Platform.OS === 'ios' ? 'spinner' : 'default'}
   onChange={(_, d) => { setShowPicker(false); if (d) setDate(d); }} /> )}
  <Text style={[styles.label, textStyle]}>Detalles adicionales</Text>
  <TextInput style={[styles.input, { height: "2.3%" }]} multiline placeholder="Ej. zona de acceso, llaves…"
   value={notes}onChangeText={setNotes}/>
 <RNButton title="Seleccionar foto" onPress={pickImage} />
   {image && (
   <Image source={{ uri: image }}
   style={{ width: 200, height: 200, marginVertical: 10 }} /> )}
 <TextInput style={styles.input} placeholder="Escribe una dirección"
  value={query} onChangeText={text => { setQuery(text)
 loadSuggestions(text) }} />
   <FlatList
   data={suggestions}
   keyExtractor={i => i.id}
   style={{ maxHeight: 150 }}
   renderItem={({ item }) => (
 <TouchableOpacity onPress={() => onSelect(item)} style={styles.item}>
  <Text style={styles.itemText}>{item.title}</Text>
 </TouchableOpacity>)}/>
  <MapViewBox region={region} marker={marker} />
 <TouchableOpacity style={styles.locationButton} onPress={goToCurrentLocation}>
  <Text style={styles.locationText}>📍 Mi ubicación</Text>
 </TouchableOpacity>
 {submitting ? ( <ActivityIndicator style={{ margin: 16 }} /> ) : (
 <RNButton title="Enviar solicitud" onPress={handleSubmit} />)}
</ScrollView>
);}
