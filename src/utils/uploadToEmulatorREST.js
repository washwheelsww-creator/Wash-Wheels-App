// src/utils/uploadToEmulatorREST.js
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

/**
 * Sube un archivo local (file://...) al Storage emulator usando la API REST del emulator.
 * - uri: ruta local (file://...)
 * - remotePath: ruta destino en el bucket (ej: "solicitudes/imagen.jpg")
 * - options.host: host:port del emulator (opcional). Por defecto:
 *    - Android emulator AVD -> 10.0.2.2:9199
 *    - Otros (iOS simulator, web, Expo Go en PC) -> localhost:9199
 *    - Para dispositivo físico pasa "192.168.x.y:9199"
 * - options.bucket: nombre del bucket (por defecto "wash-wheels.firebasestorage.app")
 *
 * Retorna: { meta, downloadUrl }
 */
export default async function uploadToEmulatorREST(
  uri,
  remotePath,
  { host, bucket } = {}
) {
  if (!uri) throw new Error("uploadToEmulatorREST: uri requerido");
  if (!remotePath) throw new Error("uploadToEmulatorREST: remotePath requerido");

  const defaultHost =
    Platform.OS === "android" ? "10.0.2.2:9199" : "localhost:9199";
  const emulatorHost = host || defaultHost;
  const storageBucket = bucket || "wash-wheels.firebasestorage.app";

  // 1) leer como base64
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  if (!base64) throw new Error("No se pudo leer archivo como base64");

  // 2) base64 -> Uint8Array
  let binary;
  if (typeof global.atob === "function") {
    binary = atob(base64);
  } else if (typeof Buffer !== "undefined") {
    binary = Buffer.from(base64, "base64").toString("binary");
  } else {
    throw new Error("No hay atob ni Buffer para decodificar base64");
  }
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);

  // 3) POST al emulator
  const url = `http://${emulatorHost}/v0/b/${encodeURIComponent(
    storageBucket
  )}/o?name=${encodeURIComponent(remotePath)}&uploadType=media`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": String(bytes.byteLength),
    },
    body: bytes.buffer,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} ${text}`);
  }

  const json = await res.json();

  // 4) URL para descargar desde el emulator
  const downloadUrl = `http://${emulatorHost}/v0/b/${encodeURIComponent(
    storageBucket
  )}/o/${encodeURIComponent(json.name)}?alt=media`;

  return { meta: json, downloadUrl };
}