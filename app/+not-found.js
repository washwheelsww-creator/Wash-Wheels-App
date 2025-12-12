// app/+not-found.js
import { Stack, useRouter } from 'expo-router'; // useRouter de expo-router
import { Pressable } from 'react-native'; // Pressable de react-native
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import useGlobalStyles from '../styles/global';

export default function NotFoundScreen() {
  const router = useRouter();
  const styles =useGlobalStyles();
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.containerCenter}>
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
