// app/cliente/ajustes.js
import { useRouter } from "expo-router";
import { useState } from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";
import useGlobalStyles from "../../styles/global";

export default function AjustesCliente() {
  const styles = useGlobalStyles();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(false);

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", maxWidth: 720, alignSelf: "center" }}>
        <Text style={styles.h2}>Ajustes</Text>

        <View style={{ marginTop: 12, padding: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={styles.text}>Notificaciones</Text>
            <Switch value={notifications} onValueChange={setNotifications} />
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.text}>Compartir ubicación</Text>
            <Switch value={location} onValueChange={setLocation} />
          </View>
        </View>

        <TouchableOpacity style={[styles.btn, styles.btnOutline, { marginTop: 18 }]} onPress={() => router.back()}>
          <Text style={styles.btnText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}