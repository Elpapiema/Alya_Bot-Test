// plugins/tool-tourl2.js
import { uploadFile } from "../lib/catbox-api.js";
import fs from "fs";
import path from "path";

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";
  if (!mime) throw `✳️ Responde a una imagen, video o audio con *${usedPrefix + command}*`;

  // Descargar archivo temporal
  let media = await q.download();
  let ext = mime.split("/")[1];
  let filename = path.join("./tmp/" + Date.now() + "." + ext);
  fs.writeFileSync(filename, media);

  try {
    let url = await uploadFile(filename);
    await m.reply(`✅ Archivo subido con éxito:\n${url}`);
  } catch (e) {
    await m.reply("❌ Error al subir el archivo");
    console.error(e);
  } finally {
    fs.unlinkSync(filename); // borrar archivo temporal
  }
};

handler.command = /^tourl2$/i;
handler.help = ["tourl2"];
handler.tags = ["tools"];

export default handler;