// app/lavador/Actividades.js
import React from 'react';
import { View, Text } from 'react-native';
import useGlobalStyles from '../../styles/global';

export default function Actividades() {
  const styles = useGlobalStyles();
  return (
    <View>
      <Text style={styles.title}>ACTIVIDADES</Text>
    </View>
  );
}
