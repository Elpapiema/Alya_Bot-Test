// Codigo creado por @Emma (Violet's Version)
// Github: Elpapiema
// Este código es parte de Alya Bot y está bajo licencia GPL-3.0
// Puedes usarlo, modificarlo y redistribuirlo bajo los términos de la GPL-3.0

import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";

/**
 * @param {string} filePath 
 * @returns {Promise<string>} 
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
  return url.trim(); 
}