// app/lavador/Solicitudes.js
import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { db } from '../../firebase/firebase'; // ajusta ruta si necesitas
import useGlobalStyles from '../../styles/global';

const { width, height } = Dimensions.get('window');

export default function Solicitudes() {
  const styles = useGlobalStyles();
  const router = useRouter();
  const mapRef = useRef(null);

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    // escucha en tiempo real todas las solicitudes
    const col = collection(db, 'solicitudes');
    const unsub = onSnapshot(col, (snap) => {
      const items = snap.docs.map((d) => {
        const data = d.data();
        // normaliza ubicación: puede venir como {lat, lng} o GeoPoint
        let lat = null, lng = null;
        if (data.location) {
          if (data.location.latitude !== undefined && data.location.longitude !== undefined) {
            lat = data.location.latitude; lng = data.location.longitude;
          } else if (data.location.lat !== undefined && data.location.lng !== undefined) {
            lat = data.location.lat; lng = data.location.lng;
          }
        }
        return { id: d.id, ...data, lat, lng };
      }).filter(i => i.lat !== null && i.lng !== null);
      setSolicitudes(items);
      setLoading(false);
    }, (err) => {
      console.error('MapaSolicitudes onSnapshot error:', err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const goToMarker = (item) => {
    setSelectedId(item.id);
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: item.lat,
        longitude: item.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  };

  const openDetail = (id) => {
    router.push(`/cliente/solicituddetalle/${id}`);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  // default region: center on first marker or fallback
  const initialRegion = solicitudes.length > 0 ? {
    latitude: solicitudes[0].lat,
    longitude: solicitudes[0].lng,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08
  } : {
    latitude: -34.6037, longitude: -58.3816, latitudeDelta: 0.5, longitudeDelta: 0.5
  };

  return (
    <View style={[styles.container, styles.screenBg]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {solicitudes.map(item => (
          <Marker
            key={item.id}
            coordinate={{ latitude: item.lat, longitude: item.lng }}
            pinColor={selectedId === item.id ? '#e74c3c' : '#274bb1'}
            onPress={() => goToMarker(item)}
          >
            <Callout tooltip onPress={() => openDetail(item.id)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{item.carModel || 'Solicitud'}</Text>
                <Text style={styles.calloutSub}>{item.status || 'pending'}</Text>
                <Text style={styles.calloutTap}>Toca para ver</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* lista inferior rápida para navegar entre markers */}
      <View style={styles.listWrap}>
        <FlatList
          data={solicitudes}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, selectedId === item.id ? styles.cardActive : null]}
              onPress={() => {
                goToMarker(item);
              }}
              onLongPress={() => openDetail(item.id)}
            >
              <Text style={styles.cardTitle}>{item.carModel || 'Auto'}</Text>
              <Text style={styles.cardSmall}>{item.status || 'pending'}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}