import axios from "axios"
import FormData from "form-data"

let handler = async (m, { conn, command, usedPrefix }) => {
  if (!m.quoted && !m.mimetype && !m.msg?.mimetype)
    return m.reply(`✦ Debes responder a una imagen o enviar una con *${usedPrefix + command}*`)

  let q = m.quoted ?? m
  let mime = q.mimetype || q.msg?.mimetype || ""

  if (!/image/.test(mime))
    return m.reply("✦ El archivo debe ser una imagen")

  let img = await q.download()
  if (!img)
    return m.reply("✦ No se pudo descargar la imagen")

  try {
    let form = new FormData()
    form.append("image", img, {
      filename: "input.jpg",
      contentType: mime
    })

    let res = await axios.post(
      "http://smasha.alyabot.xyz/upscale",
      form,
      {
        headers: {
          ...form.getHeaders()
        },
        responseType: "arraybuffer", // 🔑 CLAVE
        timeout: 60000
      }
    )

    await conn.sendMessage(
      m.chat,
      {
        image: res.data,
        caption: "✨ Imagen mejorada en HD"
      },
      { quoted: m }
    )

  } catch (e) {
    console.error("Upscale error:", e?.response?.data || e)
    m.reply("⚠️ Error al mejorar la imagen, inténtalo más tarde.")
  }
}

handler.command = /^hd$/i
handler.help = ["hd"]
handler.tags = ["tools"]

export default handler