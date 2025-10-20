import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';

// imageUri: string (ej: image.uri)
export async function uploadImageAndGetUrl(imageUri, pathPrefix = 'solicitudes') {
  if (!imageUri) return null;
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const storage = getStorage();
    const filename = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2,9)}.jpg`;
    const ref = storageRef(storage, filename);
    await uploadBytes(ref, blob);
    const downloadUrl = await getDownloadURL(ref);
    console.log('uploadImageAndGetUrl -> downloadUrl:', downloadUrl);
    return downloadUrl;
  } catch (err) {
    console.error('uploadImageAndGetUrl error:', err);
    throw err;
  }
}