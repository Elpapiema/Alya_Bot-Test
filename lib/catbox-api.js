// lib/catbox-api.js
import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";

/**
 * Sube un archivo a Catbox
 * @param {string} filePath - Ruta local del archivo a subir
 * @returns {Promise<string>} - URL pública del archivo en Catbox
 */
export async function uploadFile(filePath) {
  const form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("fileToUpload", fs.createReadStream(filePath));

  const res = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: form,
  });

  const url = await res.text();
  return url.trim(); // Catbox devuelve la URL directa del archivo
}