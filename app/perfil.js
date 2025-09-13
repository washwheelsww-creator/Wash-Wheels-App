//wash-wheels-app/wash-wheels-app/app/perfil.js
import React, {useContext} from "react";
import { View, Text, Image, TouchableOpacity, SafeAreaView,ScrollView } from "react-native";
import styles from "../styles/global";

import BackButton from "../components/BackButton";

export default function Perfil() {
  
  return (
  
   <View style={styles.header}>
    <BackButton style={styles.backButton}/>
    <Text style={styles.title}>Mi Perfil</Text>
   </View>
  
  );
}