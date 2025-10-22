// app/cliente/solicitarlavado.js
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";

import MapViewBox from "../../components/MapViewBox";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";
import ImagePickerButton from "../../src/components/imagepickerbutton";
import { colores, marcasYModelos } from "../../src/data/consts";
import useImagePicker from "../../src/hooks/useImagePicker";
import useLocation from "../../src/hooks/useLocation";
import uploadToEmulatorREST from "../../src/utils/uploadToEmulatorREST";
import useGlobalStyles from "../../styles/global";

export default function SolicitarLavado() {
  const { user } = useAuth();
  const router = useRouter();
  const styles = useGlobalStyles();

  const colorScheme = "light"; 
  const isDark = colorScheme === "dark";
  const bgStyle = { backgroundColor: isDark ? "#000000" : "#FFFFFF" };
  const txStyle = { color: isDark ? "#FFFFFF" : "#000000" };
  
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [customCarModel, setCustom] = useState("");
  const [color, setColor] = useState("");
  const [customColor, setCustomCol] = useState("");
  const [serviceType, setService] = useState("basico");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { image, setImage, pickImage } = useImagePicker();
  const { location, region, setRegion, marker, setMarker, goToCurrentLocation } = useLocation();

  const onMarkerDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    setRegion((r) => ({ ...r, latitude, longitude }));
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert("Autenticación necesaria", "Inicia sesión para enviar una solicitud.");
      return;}

  const finalCarModel =
      marca === "Otro" || modelo === "Otro"
        ? customCarModel?.trim() || `${marca} ${modelo}`
        : modelo || marca || customCarModel;
  const finalColor = color === "Otro" ? customColor?.trim() || color : color;

  const coordsToSend =
      marker ?? (location ? { latitude: location.latitude, longitude: location.longitude } : null);

    if (!coordsToSend) {
      Alert.alert("Ubicación requerida", "Selecciona tu ubicación en el mapa.");
      return;
    }

  setSubmitting(true);
    try {
      let photoURL = null;
      if (image) {
        const remotePath = `solicitudes/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.jpg`;
        const { meta, downloadUrl } = await uploadToEmulatorREST(image, remotePath, {
        });
        console.log("Upload meta:", meta);
        console.log("Download URL (emulator):", downloadUrl);
        photoURL = downloadUrl;
      }

      await addDoc(collection(db, "solicitudes"), {
        clientId: user.uid,
        clientName: user.displayName || user.email,
        carModel: finalCarModel || null,
        color: finalColor || null,
        serviceType,
        notes,
        coords: coordsToSend,
        status: "pending",
        photoURL: photoURL || null,
        timestamp: serverTimestamp(),
      });

      Alert.alert("¡Solicitud enviada!", "Revisa tu sección de Mis solicitudes.");
      // reset form
      setMarca("");
      setModelo("");
      setCustom("");
      setColor("");
      setCustomCol("");
      setService("basico");
      setNotes("");
      setImage(null);
      router.replace("/cliente");
    } catch (err) {
      console.error("handleSubmit error:", err);
      Alert.alert("Error", err.message || "No se pudo enviar la solicitud.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderHeader = useCallback(() => {
    return (
      <View style={[bgStyle]}>
        <Text style={[styles.heading, txStyle]}>Rellenar datos</Text>

        <Text style={[styles.label, txStyle]}>Marca</Text>
        <Picker
          selectedValue={marca ?? ""}
          onValueChange={(v) => {
            setMarca(v ?? "");
            setModelo("");
            setCustom("");
          }}
        >
          <Picker.Item label="--Selecciona marca--" value="" />
          {Object.keys(marcasYModelos || {}).map((m) => (
            <Picker.Item key={m} label={m} value={m} />
          ))}
          <Picker.Item label="Otro" value="Otro" />
        </Picker>

        {marca !== "" && Array.isArray(marcasYModelos[marca]) && (
          <>
            <Text style={[styles.label, txStyle]}>Modelo</Text>
            <Picker
              selectedValue={modelo ?? ""}
              onValueChange={(v) => {
                setModelo(v ?? "");
                if (v !== "Otro") setCustom("");
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

        {(marca === "Otro" || modelo === "Otro") && (
          <TextInput
            style={styles.input}
            placeholder="Especifica marca y modelo"
            value={customCarModel}
            onChangeText={(t) => setCustom(t ?? "")}
          />
        )}

        <Text style={[styles.label, txStyle]}>Color</Text>
        <Picker selectedValue={color ?? ""} onValueChange={(v) => setColor(v ?? "")}>
          <Picker.Item label="--Selecciona color--" value="" />
          {(colores || []).map((c) => (
            <Picker.Item key={c} label={c} value={c} />
          ))}
          <Picker.Item label="Otro" value="Otro" />
        </Picker>

        {color === "Otro" && (
          <TextInput
            style={styles.input}
            placeholder="Color personalizado"
            value={customColor}
            onChangeText={(t) => setCustomCol(t ?? "")}
          />
        )}

        <Text style={[styles.label, txStyle]}>Tipo de servicio</Text>
        <Picker selectedValue={serviceType ?? ""} onValueChange={(v) => setService(v ?? "")}>
          <Picker.Item label="Básico" value="basico" />
          <Picker.Item label="Premium" value="premium" />
          <Picker.Item label="Deluxe" value="deluxe" />
        </Picker>

        <Text style={[styles.label, txStyle]}>Detalles adicionales</Text>
        <TextInput
          style={[styles.input, { height: 30 }]}
          multiline
          placeholder="Ej. zona de acceso, llaves…"
          value={notes}
          onChangeText={setNotes}
/>

   <ImagePickerButton image={image} onPick={pickImage} />
  </View>
    );
  }, [marca, modelo, customCarModel, color, customColor, serviceType, marker, image]);

  const renderFooter = () => (
  <View style={{ paddingHorizontal: 18, paddingTop: 12, paddingBottom: 24 }}>
    <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 8 }}>
    <TouchableOpacity onPress={goToCurrentLocation} style={styles.currentLocButton}>
      <Text style={styles.locationText}>📍</Text>
    </TouchableOpacity>
  </View>

  <View style={{ width: "100%", height: 300, borderRadius: 8, overflow: "hidden" }}>
  <MapViewBox
  region={region}
  marker={marker}
  onMarkerDragEnd={onMarkerDragEnd}
  onRegionChangeComplete={setRegion}
  goToCurrentLocation={goToCurrentLocation} />
  </View>

  <View style={{ marginTop: 12 }}>
    {submitting ? (
  <ActivityIndicator style={{ margin: 16 }} />
    ) : (
  <TouchableOpacity style={styles.button} onPress={handleSubmit}>
    <Text style={styles.buttonText}>Enviar solicitud</Text>
  </TouchableOpacity> )}
  </View>
</View> );

  if (!location) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />; }

  return (
  <SafeAreaView style={{ flex: 1 }}>
  <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
   <FlatList
   style={{ flex: 1 }}
   data={[]}
   ListHeaderComponent={renderHeader}
   ListFooterComponent={renderFooter}
   contentContainerStyle={[styles.containerScroll, bgStyle, { paddingBottom: 220 }]}
   keyboardShouldPersistTaps="always"
   keyboardDismissMode="none"
   nestedScrollEnabled
   removeClippedSubviews={false} />
  </KeyboardAvoidingView>
  </SafeAreaView>
  );
}