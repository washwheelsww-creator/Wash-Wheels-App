import * as Location from "expo-location";
import { useEffect, useState } from "react";

export default function useLocation(initial = { latitude: 19, longitude: -98.2 }) {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({ ...initial, latitudeDelta: 0.01, longitudeDelta: 0.01 });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: 5 });
      setLocation(loc.coords);
      setRegion(r => ({ ...r, latitude: loc.coords.latitude, longitude: loc.coords.longitude }));
    })();
  }, []);

  return { location, region, setRegion, setLocation };
}