//src/components/imagepcikerbutton.js
import { Image, Text, TouchableOpacity, View } from "react-native";
import useGlobalStyles from "../../styles/global";

export default function ImagePickerButton({ image, onPick }) {
  const styles =useGlobalStyles();
  return (
    <View>
      <TouchableOpacity  onPress={onPick} style={styles.container}>
        <Text style={styles.textBase}>Seleccionar foto</Text>
      </TouchableOpacity>
      {image ? <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 10 }} /> : null}
    </View>
  );
}