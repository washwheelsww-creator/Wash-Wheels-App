// components/MapViewBox.js
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import useGlobalStyles from '../styles/global';

export function MapViewBox() {
 const styles = useGlobalStyles();
  return (
    <View style={styles.container}>
      <WebView
        style={styles.web}
        source={require('../assets/map.html')}
      />
    </View>
  )
}

