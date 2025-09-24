// components/MapViewBox.js
import Constants from 'expo-constants'
import MapView, { UrlTile } from 'react-native-maps'

export default function MapboxTileMap() {
  const token = Constants.expoConfig.extra.MAPBOX_TOKEN
  const urlTemplate = 
    `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}` +
    `?access_token=${token}`

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 19.0,
        longitude: -98.2,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      }}
    >
      <UrlTile
        urlTemplate={urlTemplate}
        maximumZ={18}
        flipY={false}
      />
    </MapView>
  )
}