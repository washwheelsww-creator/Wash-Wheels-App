// app/components/LocationPicker.js
import React, { useState } from 'react'
import { View, TextInput, Button, Alert } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import useGlobalStyles from '../styles/global'

export default function LocationPicker({ onLocationSelected }) {
  const styles = useGlobalStyles();
  const [address, setAddress] = useState('');
  const [coords, setCoords]   = useState(null);

  const findLocation = async () => {
    if (!address.trim()) {
      return Alert.alert('Dirección vacía', 'Escribe alguna dirección primero.')
    }

    // Solicitar permiso de ubicación
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      return Alert.alert('Permiso denegado', 'Necesitamos permiso de ubicación.')
    }

    try {
      // Convierte dirección a lat/lng
      const geocoded = await Location.geocodeAsync(address)
      if (geocoded.length === 0) {
        return Alert.alert('No encontrado', 'No se halló esa dirección.')
      }
      const { latitude, longitude } = geocoded[0]
      setCoords({ latitude, longitude })
      onLocationSelected && onLocationSelected({ latitude, longitude, address })
    } catch (err) {
      Alert.alert('Error', 'No se pudo convertir la dirección.')
    }
  }

  return (
    <View style={{ marginVertical: 16 }}>
      <TextInput
        style={[styles.input, { marginBottom: 8 }]}
        placeholder="Escribe tu dirección"
        placeholderTextColor={styles.input.color || '#666'}
        value={address}
        onChangeText={setAddress}
        onSubmitEditing={findLocation}
      />
      <Button title="Buscar en el mapa" onPress={findLocation} />

      {coords && (
        <MapView
          style={{ height: 200, marginTop: 12, borderRadius: 8 }}
          initialRegion={{
            ...coords,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={coords} title="Ubicación seleccionada" />
        </MapView>
      )}
    </View>
  )
}