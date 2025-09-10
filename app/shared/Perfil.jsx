import React, {useContext} from "react";
import { View, Text, Image, TouchableOpacity, SafeAreaView,ScrollView } from "react-native";
import styles from "../../styles/global";
import { cerrarSesion } from "../../firebase/firebaseService";
import { useNavigation } from "@react-navigation/native";
import auth from "../../firebase/firebase"
import { AuthContext } from "../../context/AuthContext"
import BackButton from "../../components/BackButton";

export default function PerfilScreen() {
  const { user, userProfile, loading } = useContext(AuthContext);
  const navigation = useNavigation();
  if (loading) {
    return <Text style={styles.value}>Cargando perfil…</Text>; }
  const avatarSource = userProfile.photoURL
    ? { uri: userProfile.photoURL }
    : user.photoURL
    ? { uri: user.photoURL }
    : require("../../assets/images/sin-foto.png");

  const handleSignOut = async () => {
    try {
      await cerrarSesion(auth);
      navigation.reset({
        index: 0,
        routes: [{
      name: 'AuthStack',
      state: { index: 0, routes: [{ name: 'Login' }] }}]
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }};

  return (
  <SafeAreaView style={styles.container}> 
   <View style={styles.header}>
    <BackButton style={styles.backButton}/>
    <Text style={styles.title}>Mi Perfil</Text>
   </View>
  <ScrollView contentContainerStyle={styles.content}>
    <Image source={avatarSource}  style={styles.avatar}/>
   <View style={styles.field}>
    <Text style={styles.label}>Nombre a mostrar</Text>
    <Text style={styles.value}>{userProfile.displayName }</Text>
  
    <Text style={styles.label}>Username</Text>
    <Text style={styles.value}>{userProfile.username ?? " No username encontrado"}</Text>
 
    <Text style={styles.label}>Correo</Text>
    <Text style={styles.value}>{userProfile.email ?? "No email visto"}</Text>

    <Text style={styles.label}>Rol</Text>
    <Text style={styles.value}>{userProfile.role ?? "Sin Rol" }</Text>
    </View>
   </ScrollView>
    <TouchableOpacity style={styles.button} onPress={handleSignOut}>
      <Text style={styles.buttonText}>Cerrar sesión</Text>
    </TouchableOpacity>

    </SafeAreaView>
  );
}