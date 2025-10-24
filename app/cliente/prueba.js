// app/cliente/prueba.js
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useGlobalStyles from '../../styles/global';

export default function Prueba() {
  const styles = useGlobalStyles();
  const textStyleNames = Object
    .keys(styles)
    .filter(key => Boolean(styles[key].fontSize))

  return (
  <SafeAreaView style={styles.containerCenter}>
   <ScrollView contentContainerStyle={styles.containerScroll}>
    {textStyleNames.map(name => (
    <View key={name} style={{ marginBottom: 24 }}>
    {/* Nombre del estilo */}
    <Text style={styles.label}>{name}</Text>
    {/* Ejemplo de cómo luce ese estilo */}
    <Text style={styles[name]}>
    Este texto usa el estilo 
    <Text style={{ fontStyle: 'italic' }}>{name}</Text>
    </Text>
    </View>
    ))}
   </ScrollView>
  </SafeAreaView>
  );
}
