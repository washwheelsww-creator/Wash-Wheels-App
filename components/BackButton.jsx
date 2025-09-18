// app/components/BackButton.js
import React from 'react';
import { TouchableOpacity, }from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import useGlobalstyles from"../styles/global";

export default function BackButton({

  size  = 24,
  style = {}
}) {
  const styles = useGlobalstyles();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={[styles.backButton, style]}
      onPress={() => navigation.goBack()}
      activeOpacity={0.7}
    >
      <Ionicons name="arrow-back" size={size} style={styles.textBase.color} />
    </TouchableOpacity>
  );
}


