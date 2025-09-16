//wash-wheels-app/wash-wheels-app/app/perfil.js
import React, {useContext} from "react";
import { View, Text, Image, TouchableOpacity,ScrollView } from "react-native";
import styles from "../styles/global";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Perfil() {
  const { user } = useAuth();

  if (!user) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No hay usuario autenticado.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Usuario:</Text>
          <Text style={styles.value}>{user.username}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{user.displayName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Rol:</Text>
          <Text style={styles.value}>{user.role}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
