// app/cliente/solicitarlavado.js
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useState, } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [customCarModel, setCustom] = useState("");
  const [color, setColor] = useState("");
  const [customColor, setCustomCol] = useState("");
  const [serviceType, setService] = useState("basico");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setMarca("");
    setModelo("");
    setCustom("");
    setColor("");
    setCustomCol("");
    setService("basico");
    setNotes("");
    setImage(null);
    setMarker(null);
    setShowPreview(false);
  }, []);

  const { image, setImage, pickImage } = useImagePicker();
  const { location, region, setRegion, marker, setMarker, goToCurrentLocation } = useLocation();

   const finalCarModel =
  marca === "Otro"
    ? customCarModel?.trim() // aquí el usuario escribió marca+modelo
    : modelo === "Otro"
      ? `${marca} ${customCarModel?.trim()}` // aquí el usuario escribió solo modelo
      : `${marca} ${modelo}`.trim();
  const finalColor = color === "Otro" ? customColor?.trim() || color : color;
   
  const onMarkerDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    setRegion((r) => ({ ...r, latitude, longitude }));
  };

  const handleSubmit = async () => {
  if (!user) {
    Alert.alert("Autenticación necesaria", "Inicia sesión para enviar una solicitud.");
    return;
  }

  // Validar marca y modelo
  if (!marca) {
    Alert.alert("Dato requerido", "Selecciona una marca.");
    return;
  }
  if (!modelo && marca !== "Otro") {
    Alert.alert("Dato requerido", "Selecciona un modelo.");
    return;
  }
  if ((marca === "Otro" || modelo === "Otro") && !customCarModel.trim()) {
    Alert.alert("Dato requerido", "Especifica el modelo o la marca+modelo.");
    return;
  }

  // Validar color
  if (!color) {
    Alert.alert("Dato requerido", "Selecciona un color.");
    return;
  }
  if (color === "Otro" && !customColor.trim()) {
    Alert.alert("Dato requerido", "Especifica el color personalizado.");
    return;
  }

  // Validar tipo de servicio
  if (!serviceType) {
    Alert.alert("Dato requerido", "Selecciona un tipo de servicio.");
    return;
  }

  // Validar ubicación
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
        const { downloadUrl } = await uploadToEmulatorREST(image, remotePath, {});
        photoURL = downloadUrl;
      }

      await addDoc(collection(db, "solicitudes"), {
        clienteId: user.uid,
        clienteName: user.displayName || user.email,
        carModel: finalCarModel || null,
        color: finalColor || null,
        serviceType,
        notes,
        coords: coordsToSend,
        status: "pendiente",
        lavadorId: null,
        lavadorName: null,
        photoURL: photoURL || null,
        timestamp: serverTimestamp(),
        assigned: false,
      });

      Alert.alert("¡Solicitud enviada!", "Revisa tu sección de Mis solicitudes.");
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

  if (!location) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
  <SafeAreaView style={styles.screen}>
  <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} >
  <ScrollView contentContainerStyle={[styles.containerScroll, { paddingBottom: 220 }]} keyboardShouldPersistTaps="handled" >
    <View style={styles.container}>
      <View style={styles.header}>
  <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
    <Text style={{ color: "#007AFF" }}>← Regresar</Text>
  </TouchableOpacity>
            
  <Text style={[styles.h2, { marginTop: 8 }]}>Rellenar datos</Text>
      </View>

  {/* Marca */}
<Text style={styles.label}>Marca</Text>
<Picker
  selectedValue={marca ?? ""}
  onValueChange={(v) => {
    setMarca(v ?? "");
    setModelo("");
    setCustom(""); // limpiar campo custom
  }}
>
  <Picker.Item label="--Selecciona marca--" value="" />
  {Object.keys(marcasYModelos || {}).map((m) => (
    <Picker.Item key={m} label={m} value={m} />
  ))}
  <Picker.Item label="Otro" value="Otro" />
</Picker>

{/* Modelo */}
{marca !== "" && Array.isArray(marcasYModelos[marca]) && (
  <>
    <Text style={styles.label}>Modelo</Text>
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

{/* Input cuando la marca es Otro → pide marca+modelo */}
{marca === "Otro" && (
  <TextInput
    placeholder="Especifica marca y modelo"
    placeholderTextColor={isDark ? "#8C8C8C" : "#999999"}
    value={customCarModel}
    onChangeText={(t) => setCustom(t ?? "")}
    style={[styles.input, { height: 50, color: isDark ? "#fff" : "#000" }]}
  />
)}

{/* Input cuando el modelo es Otro pero la marca ya está seleccionada → pide solo modelo */}
{marca !== "Otro" && modelo === "Otro" && (
  <TextInput
    placeholder={`Especifica modelo de ${marca}`}
    placeholderTextColor={isDark ? "#8C8C8C" : "#999999"}
    value={customCarModel}
    onChangeText={(t) => setCustom(t ?? "")}
    style={[styles.input, { height: 50, color: isDark ? "#fff" : "#000" }]}
  />
)}
  {/* Color */} 
  <Text style={styles.label}>Color</Text>
    <Picker selectedValue={color ?? ""} onValueChange={(v) => setColor(v ?? "")}>
     <Picker.Item label="--Selecciona color--" value="" />
      {(colores || []).map((c) => (
      <Picker.Item key={c} label={c} value={c} /> ))}
      <Picker.Item label="Otro" value="Otro" />
    </Picker>

    {color === "Otro" && (
    <TextInput placeholder="Color personalizado" placeholderTextColor={isDark ? "#8C8C8C" : "#999999"} value={customColor} 
    onChangeText={(t) => setCustomCol(t ?? "")} style={[styles.input, { height: 50, color: isDark ? "#fff" : "#000" }]} />)}

  {/* Tipo de servicio */}
    <Text style={styles.label}>Tipo de servicio</Text>
    <Picker selectedValue={serviceType ?? ""} onValueChange={(v) => setService(v ?? "")}>
    <Picker.Item label="Básico" value="basico" />
    <Picker.Item label="Premium" value="premium" />
    <Picker.Item label="Deluxe" value="deluxe" />
    </Picker>

  {/* Detalles adicionales */}
  <Text style={styles.label}>Detalles adicionales</Text>
    <TextInput value={notes} onChangeText={setNotes} style={[styles.input, { height: 100, color: isDark ? "#fff" : "#000", padding: 8 }]}
     multiline placeholder="Ej. zona de acceso, llaves…" placeholderTextColor={isDark ? "#8C8C8C" : "#999999"} />

  <ImagePickerButton image={image} onPick={pickImage} />

  {/* Mapa */}
   <View style={{ marginTop: 12 }}>
      <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 8 }}>
   <TouchableOpacity onPress={goToCurrentLocation} style={styles.currentLocButton}>
     <Text style={styles.locationText}>📍</Text>
   </TouchableOpacity>
   </View>

  <View style={{ width: "100%", height: 300, borderRadius: 8, overflow: "hidden" }}>
    <MapViewBox region={region} marker={marker} onMarkerDragEnd={onMarkerDragEnd} onRegionChangeComplete={setRegion} 
    goToCurrentLocation={goToCurrentLocation} />
     </View>
  </View>

<View style={{ marginTop: 12 }}>
  {submitting ? (
    <ActivityIndicator style={{ margin: 16 }} />
  ) : (
    <>
      <TouchableOpacity style={styles.btn} onPress={() => setShowPreview(true)}>
        <Text style={styles.btnText}>Verificar solicitud</Text>
      </TouchableOpacity>

      {showPreview && (
        <View style={[styles.card, { marginTop: 20 }]}>
          <Text style={styles.h2}>Verificar solicitud</Text>

          <Text style={styles.text}>🚘 Auto: {finalCarModel || "No especificado"}</Text>
          <Text style={styles.text}>🎨 Color: {finalColor || "No especificado"}</Text>
          <Text style={styles.text}>🛠 Servicio: {serviceType}</Text>
          <Text style={styles.text}>📝 Notas: {notes || "-"}</Text>
          <Text style={styles.text}>📍 Ubicación:</Text>
    <View style={{ width: 300 , borderRadius: 8, overflow: "hidden", marginTop: 6, flex: 1,borderWidth: 1, }}>
      <MapViewBox region={{ ...region, latitudeDelta: 0.003, longitudeDelta: 0.003, }}
 marker={marker} onMarkerDragEnd={() => {}}  onRegionChangeComplete={() => {}} goToCurrentLocation={() => {}} style = {{flex: 1}}  />
</View>

          {image && <Text style={styles.text}>📷 Foto seleccionada</Text>}

          <View style={{ flexDirection: "row", marginTop: 12 }}>
            <TouchableOpacity
              style={[styles.btn, { flex: 1, marginRight: 8 }]}
              onPress={() => setShowPreview(false)}
            >
              <Text style={styles.btnText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnPrimary, { flex: 1 }]}
              onPress={handleSubmit}
            >
              <Text style={styles.btnText}>✅ Confirmar y enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);}