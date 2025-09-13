// app/index.js
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { user } = useAuth();
  const router = useRouter();

  if (user) {
    return <Redirect href={user.role === 'lavador' ? '/lavador' : '/cliente'} />;
  }
  return (
    <View style={styles.container}>
      <Button title="Soy cliente" onPress={() => router.push({ pathname: '/auth/login', params: { role: 'cliente' } })} />
      <Button title="Soy lavador" onPress={() => router.push({ pathname: '/auth/login', params: { role: 'lavador' } })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, gap: 16 }
});