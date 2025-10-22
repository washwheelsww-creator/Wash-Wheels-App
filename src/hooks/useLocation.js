import * as Location from "expo-location";
import { useEffect, useState } from "react";

export default function useLocation(initial = { latitude: 19.0, longitude: -98.2 }) {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({ ...initial, latitudeDelta: 0.01, longitudeDelta: 0.01 });
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const loc = await Location.getCurrentPositionAsync({ accuracy: 5 });
        const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
        setLocation(loc.coords);
        setRegion((r) => ({ ...r, ...coords }));
        setMarker(coords);
      } catch (e) {
        console.error("useLocation error", e);
      }
    })();
  }, []);

  const goToCurrentLocation = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: 5 });
      const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      setLocation(loc.coords);
      setRegion((r) => ({ ...r, ...coords }));
      setMarker(coords);
    } catch (e) {
      console.error("goToCurrentLocation error", e);
    }
  };

  return { location, region, setRegion, marker, setMarker, goToCurrentLocation };
}