import { Image, Text, TouchableOpacity } from "react-native";
export default function ImagePickerButton({ image, onPick }) {
  return (
    <>
      <TouchableOpacity onPress={onPick}><Text>Seleccionar foto</Text></TouchableOpacity>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </>
  );
}