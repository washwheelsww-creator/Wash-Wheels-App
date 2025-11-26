// app/cliente/menu/encuesta.js
import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../../../firebase/firebase";
import useGlobalStyles from "../../../styles/global";

export default function Encuesta() {
  const styles = useGlobalStyles();
  const [rating, setRating] = useState("5");
  const [notes, setNotes] = useState("");
  const router = useRouter();
  const submit = async () => {
    try {
      await addDoc(collection(db, "encuestas"), { rating: Number(rating), notes: String(notes), createdAt: new Date() });
      Alert.alert("Gracias", "Tu feedback fue enviado");
      setNotes("");
      setRating("5");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo enviar la encuesta");
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", maxWidth: 720, alignSelf: "center" }}>
        <TouchableOpacity onPress={() => router.replace("/cliente/menu")} style={{ marginBottom: 12 }}>
                <Text style={{ color: "#007AFF" }}>← Regresar</Text>
              </TouchableOpacity>
        <Text style={styles.h2}>Encuesta rápida</Text>

        <View style={{ marginTop: 12 }}>
          <Text style={styles.text}>Calificación (1-5)</Text>
          <TextInput value={rating} onChangeText={setRating} keyboardType="numeric" style={styles.input} />

          <Text style={[styles.text, { marginTop: 12 }]}>Comentarios</Text>
          <TextInput value={notes} onChangeText={setNotes} style={[styles.input, { height: 100 }]} multiline />

          <TouchableOpacity style={[styles.btn, styles.btnPrimary, { marginTop: 12 }]} onPress={submit}>
            <Text style={styles.btnText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}