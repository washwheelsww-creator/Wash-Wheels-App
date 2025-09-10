// (auth)/RoleChoice.jsx
import React, { useEffect } from 'react';
import { View, Alert,TouchableOpacity, Text, Button  } from "react-native";
import { useAuth } from '../../context/AuthContext';
import styles from "../../styles/global";

export default function RoleChoice({ navigation }) {
  const { user, userProfile, pendingFlow, setPendingFlow } = useAuth();

  const handleAccess = (flow) => {
    if (flow === 'cliente') { navigation.reset({ index: 0, routes: [{ name: 'ClienteTabs' }] });} 
    else
       {  const role = userProfile?.role;
      if (role === 'lavador' || role === 'admin') { navigation.reset({ index: 0, routes: [{ name: 'LavadorTabs' }] });} 
      else 
        {Alert.alert( 'Acceso denegado', 'Solo usuarios con rol lavador o admin pueden entrar aquí.' ); }}
    setPendingFlow(null);};

  const tryFlow = (flow) => {
    setPendingFlow(flow);
    if (!user) { navigation.navigate('AuthStack', { screen: 'Register' });} 
    else { handleAccess(flow);}};

   useEffect(() => {
    if (user && pendingFlow) {
      handleAccess(pendingFlow);}}, 
    [user, pendingFlow]);

  return (
<View style={styles.container}>
<Text style={styles.welcome}>Wash Wheels</Text>
<TouchableOpacity style={styles.button} onPress={() => tryFlow('cliente')}>
    <Text style={styles.buttonText}>Solicitar Lavado</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.button} onPress={() => tryFlow('lavador')}>
    <Text style={styles.buttonText}>Ser Lavador</Text>
    
 </TouchableOpacity>

</View>

  );
}
