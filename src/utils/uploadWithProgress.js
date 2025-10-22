// snippet: upload con XHR para progreso
export function uploadWithProgress(uri, remotePath, { host, bucket, onProgress }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const hostUrl = `http://${host || "localhost:9199"}/v0/b/${encodeURIComponent(bucket || "wash-wheels.firebasestorage.app")}/o?name=${encodeURIComponent(remotePath)}&uploadType=multipart`;

    const formData = new FormData();
    formData.append("metadata", JSON.stringify({ name: remotePath, contentType: "image/jpeg" }));
    formData.append("file", { uri, name: remotePath.split("/").pop(), type: "image/jpeg" });

    xhr.open("POST", hostUrl);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Status ${xhr.status} ${xhr.responseText}`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.send(formData);
  });
}