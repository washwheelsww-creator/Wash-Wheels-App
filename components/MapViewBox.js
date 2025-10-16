// components/MapViewBox.js
import Constants from 'expo-constants';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import useGlobalStyles from '../styles/global';
export default function MapViewBox({
  region,
  marker,
  onMarkerDragEnd,
  onRegionChangeComplete,
  goToCurrentLocation,
}) {
  const token = Constants.expoConfig.extra.MAPBOX_TOKEN
  const styles = useGlobalStyles();
  const urlTemplate = 
    `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}` +
    `?access_token=${token}`

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
      >
        {marker && (
          <Marker
            coordinate={marker}
            draggable
            onDragEnd={onMarkerDragEnd}
          />
        )}
      </MapView>
    </View>
  );
}
