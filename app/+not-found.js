// app/+not-found.js
import React from 'react';
import { Stack, useRouter } from 'expo-router';      // useRouter de expo-router
import { Pressable } from 'react-native'; // Pressable de react-native
import useGlobalStyles from '../styles/global';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

export default function NotFoundScreen() {
  const router = useRouter();
  const styles =useGlobalStyles();
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">This screen does not exist.</ThemedText>

        <Pressable
          style={styles.link}
          onPress={() => {
            // Ruta lógica de tu index.js
            router.replace('/'); 
          }}
        >
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Pressable>
      </ThemedView>
    </>
  );
}
