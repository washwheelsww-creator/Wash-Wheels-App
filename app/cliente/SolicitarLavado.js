// app/cliente/solicitarlavado.js
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, KeyboardAvoidingView, Platform, Button as RNButton, SafeAreaView, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
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
 const [date, setDate] = useState(new Date());
 const [showPicker, setShowPicker] = useState(false);
 const [notes, setNotes] = useState('');
 const [image, setImage] = useState(null);
 const [submitting, setSubmitting] = useState(false); 

 const [region, setRegion] = useState({
    latitude: 19.0, longitude: -98.2,
    latitudeDelta: 0.01, longitudeDelta: 0.01,});
 const [marker, setMarker]       = useState(null)
 const [location, setLocation] = useState(null);
 const [query, setQuery]         = useState('')
 const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
   (async () => { const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso de ubicación denegado');
   return;}

  const loc = await Location.getCurrentPositionAsync({ accuracy: 5 });
  setLocation(loc.coords);
  
  const newRegion = {
    latitude: loc.coords.latitude,
    longitude: loc.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,};
  setRegion(newRegion);
  setMarker({ latitude: newRegion.latitude, longitude: newRegion.longitude });
  })();}, []);

  const loadSuggestions = useCallback(
  debounce(async (text) => {
   setQuery(text);
    if (!text) {
    setSuggestions([]);
    return;}
    try { const res = await fetch(
   `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
     text )}.json?access_token=${MAPBOX_TOKEN}`);
  const json = await res.json();
    setSuggestions(json.features || []);
      } catch (err) { console.error('Mapbox fetch error', err); } }, 300), [] );

const onSelect = (feature) => {
  const [lng, lat] = feature.center;
    const newRegion = { latitude: lat, longitude: lng, latitudeDelta: 0.01, longitudeDelta: 0.01, };
    setRegion(newRegion);
    setMarker({ latitude: lat, longitude: lng });
    setQuery(feature.place_name);
    setSuggestions([]);
};

 const goToCurrentLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
   Alert.alert('Permiso de ubicación denegado');
    return; }
 const loc = await Location.getCurrentPositionAsync({ accuracy: 5 });
  const newRegion = {
  latitude: loc.coords.latitude, longitude: loc.coords.longitude,
  latitudeDelta: 0.01, longitudeDelta: 0.01,};
    setRegion(newRegion);
    setMarker({ latitude: newRegion.latitude, longitude: newRegion.longitude });};

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

  const uploadImageAndGetUrl = async (uri) => {
    if (!uri) return null;
    const blob = await (await fetch(uri)).blob();
    const filename = `solicitudes/${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async () => {
    const finalCarModel =
      marca === 'Otro' || modelo === 'Otro' ? customCarModel : `${marca} ${modelo}`;
    const finalColor = color === 'Otro' ? customColor : color;

    if (!finalCarModel || !finalColor) {
      Alert.alert('Error', 'Debes completar marca/modelo y color.');
      return;
    }

  setSubmitting(true);
    try { const photoURL = await uploadImageAndGetUrl(image);
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
    }
  };
 const onMarkerDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    setRegion((r) => ({ ...r, latitude, longitude }));
  };

  if (!location) {
  return <ActivityIndicator style={{ flex: 1 }} size="large" />; }
  
  const renderHeader = () => (
  <View style={[ bgStyle]}>
    <Text style={[styles.heading, txStyle]}>Rellenar datos</Text>
{/* Marca */}
<Text style={[styles.label, txStyle]}>Marca</Text>
<Picker
  selectedValue={marca ?? ''}
  onValueChange={(v) => {
    setMarca(v ?? '');
    setModelo('');
    setCustom('');
  }}
>
  <Picker.Item label="--Selecciona marca--" value="" />
  {Object.keys(marcasYModelos || {}).map((m) => (
    <Picker.Item key={m} label={m} value={m} />
  ))}
  <Picker.Item label="Otro" value="Otro" />
</Picker>

{/* Modelo: solo si la marca es válida y tiene modelos */}
{marca !== '' && Array.isArray(marcasYModelos[marca]) && (
  <>
    <Text style={[styles.label, txStyle]}>Modelo</Text>
    <Picker
      selectedValue={modelo ?? ''}
      onValueChange={(v) => {
        setModelo(v ?? '');
        if (v !== 'Otro') setCustom('');
      }}
    >
      <Picker.Item label="--Selecciona modelo--" value="" />
      {(marcasYModelos[marca] || []).map((mod) => (
        <Picker.Item key={mod} label={mod} value={mod} />
      ))}
      <Picker.Item label="Otro" value="Otro" />
    </Picker>
  </>
)}

{/* Campo libre para marca/modelo cuando se elige Otro */}
{(marca === 'Otro' || modelo === 'Otro') && (
  <TextInput
    style={styles.input}
    placeholder="Especifica marca y modelo"
    value={customCarModel}
    onChangeText={(t) => setCustom(t ?? '')}
  />
)}

{/* Color */}
<Text style={[styles.label, txStyle]}>Color</Text>
<Picker selectedValue={color ?? ''} onValueChange={(v) => setColor(v ?? '')}>
  <Picker.Item label="--Selecciona color--" value="" />
  {(colores || []).map((c) => (
    <Picker.Item key={c} label={c} value={c} />
  ))}
  <Picker.Item label="Otro" value="Otro" />
</Picker>

{/* Campo libre para color personalizado */}
{color === 'Otro' && (
  <TextInput
    style={styles.input}
    placeholder="Color personalizado"
    value={customColor}
    onChangeText={(t) => setCustomCol(t ?? '')}
  />
)}

{/* Tipo de servicio */}
<Text style={[styles.label, txStyle]}>Tipo de servicio</Text>
<Picker selectedValue={serviceType ?? ''} onValueChange={(v) => setService(v ?? '')}>
  <Picker.Item label="Básico" value="basico" />
  <Picker.Item label="Premium" value="premium" />
  <Picker.Item label="Deluxe" value="deluxe" />
</Picker>

  <Text style={[styles.label, txStyle]}>Fecha preferida</Text>
  <RNButton title={date.toLocaleString()} onPress={() => setShowPicker(true)} />
  {showPicker && (
    <DateTimePicker value={date} mode="datetime" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(_, d) => {
    setShowPicker(false);
    if (d) setDate(d); }}/>)}

      <Text style={[styles.label, txStyle]}>Detalles adicionales</Text>
      <TextInput style={[styles.input, { height: 30 }]} multiline placeholder="Ej. zona de acceso, llaves…" value={notes} onChangeText={setNotes} />

      <RNButton title="Seleccionar foto" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginVertical: 10 }} />}

      <Text style={[styles.label, txStyle]}>Dirección</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe una dirección"
        value={query}
        onChangeText={loadSuggestions} // llama la función debounced
      />
    </View>
  );

  const renderFooter = () => (
    <View style={{ width: '100%', height: 300, marginVertical: 12 }}>
      <MapViewBox
        region={region}
        marker={marker}
        onMarkerDragEnd={onMarkerDragEnd}
        onRegionChangeComplete={setRegion}
        goToCurrentLocation={goToCurrentLocation}
      />

      {submitting ? (
        <ActivityIndicator style={{ margin: 16 }} />
      ) : (
        <RNButton title="Enviar solicitud" onPress={handleSubmit} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

    <FlatList
      style= {{flex: 1}}
      data={suggestions}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelect(item)} style={styles.button}>
          <Text style={styles.textBase}>{item.place_name}</Text>
        </TouchableOpacity>
      )}
      ListFooterComponent={renderFooter}
      contentContainerStyle={[styles.container, bgStyle]}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={true}
   />
    </KeyboardAvoidingView>
  </SafeAreaView>
);

}