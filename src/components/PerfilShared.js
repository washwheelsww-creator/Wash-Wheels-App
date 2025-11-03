// components/PerfilShared.js
import { Image, Text, TouchableOpacity, View } from "react-native";
import useGlobalStyles from "../../styles/global";

export default function PerfilShared({ user = {}, onEdit, role = "cliente" }) {
  const styles = useGlobalStyles();
  const name = String(user.name ?? "-");
  const email = String(user.email ?? "-");
  const photo = user.photoURL ? String(user.photoURL) : null;

  return (
  <View>
    <View style={{ alignItems: "center", marginBottom: 18 }}>
   {photo ? (
     <Image source={{ uri: photo }} style={styles.avatar} />  
    ) : (
  <View style={[styles.avatar, { backgroundColor: "#ddd", alignItems: "center", justifyContent: "center" }]}>
  <Text style={styles.text}>{name.charAt(0) ?? "-"}</Text>
    </View>  )}

    <Text style={styles.h2}>{name}</Text>
    <Text style={styles.textMuted}>{email}</Text>
    <Text style={[styles.label, { marginTop: 6 }]}>{role === "lavador" ? "Lavador" : "Cliente"}</Text>
    </View>

    <View style={styles.card}>
    <Text style={styles.cardTitle}>Resumen</Text>

    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
    <View style={{ alignItems: "center" }}>
    <Text style={styles.h2}>{String(user.activeRequests ?? 0)}</Text>
    <Text style={styles.textMuted}>Activas</Text>
    </View>

    <View style={{ alignItems: "center" }}>
    <Text style={styles.h2}>{String(user.completed ?? 0)}</Text>
    <Text style={styles.textMuted}>Completadas</Text>
    </View>

    <View style={{ alignItems: "center" }}>
    <Text style={styles.h2}>{String(user.rewards ?? 0)}</Text>
    <Text style={styles.textMuted}>Regalos</Text>
    </View>
    </View>

    <TouchableOpacity style={[styles.btn, styles.btnPrimary, { marginTop: 16 }]} onPress={onEdit}>
    <Text style={styles.btnText}>Editar perfil</Text>
    </TouchableOpacity>
    </View>
    </View>
  );
}