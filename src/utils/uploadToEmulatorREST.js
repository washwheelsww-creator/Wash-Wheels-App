// src/utils/uploadToEmulatorREST.js
import { Platform } from "react-native";

const DEFAULT_TIMEOUT = 30_000; // ms

function guessContentType(filename = "") {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";
  return "application/octet-stream";
}

export default async function uploadToEmulatorREST(uri, remotePath, { host, bucket, timeout = DEFAULT_TIMEOUT } = {}) {
  if (!uri) throw new Error("uri requerido");
  const defaultHost = Platform.OS === "android" ? "10.0.2.2:9199" : "localhost:9199";
  const emulatorHost = host || defaultHost;
  const storageBucket = bucket || "wash-wheels.firebasestorage.app";

  const filename = remotePath.split("/").pop();
  const contentType = guessContentType(filename);

  const url = `http://${emulatorHost}/v0/b/${encodeURIComponent(storageBucket)}/o?name=${encodeURIComponent(remotePath)}&uploadType=multipart`;
  console.log("uploadToEmulatorREST -> URL:", url, "file:", filename, "type:", contentType);

  const formData = new FormData();
  formData.append("metadata", JSON.stringify({ name: remotePath, contentType }));
  formData.append("file", { uri, name: filename, type: contentType });

  // timeout wrapper
  const controller = new AbortController() ?? null;
  const signal = controller ? controller.signal : undefined;
  const timer = controller ? setTimeout(() => controller.abort(), timeout) : null;

  try {
    const res = await fetch(url, { method: "POST", body: formData, signal });
    if (timer) clearTimeout(timer);
    const text = await res.text();
    if (!res.ok) {
      console.error("uploadToEmulatorREST - server error:", res.status, text);
      throw new Error(`Upload failed: ${res.status} - ${text}`);
    }
    const json = JSON.parse(text);
    const downloadUrl = `http://${emulatorHost}/v0/b/${encodeURIComponent(storageBucket)}/o/${encodeURIComponent(json.name)}?alt=media`;
    console.log("uploadToEmulatorREST - success", json.name);
    return { meta: json, downloadUrl };
  } catch (err) {
    if (timer) clearTimeout(timer);
    if (err.name === "AbortError") {
      console.error("uploadToEmulatorREST - timeout");
      throw new Error("Upload timeout");
    }
    console.error("uploadToEmulatorREST - exception:", err);
    throw err;
  }
}