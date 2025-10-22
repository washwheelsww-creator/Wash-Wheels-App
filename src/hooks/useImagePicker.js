import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export default function useImagePicker() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") throw new Error("Permiso galería denegado");
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.7 });
    const cancelled = res?.canceled ?? res?.cancelled ?? false;
    const uri = res?.assets?.[0]?.uri ?? res?.uri ?? null;
    if (!cancelled && uri) setImage(uri);
    return uri;
  };

  return { image, setImage, pickImage };
}