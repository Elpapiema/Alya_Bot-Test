import fetch from "node-fetch"
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

    let res = await fetch("http://smasha.alyabot.xyz/upscale", {
      method: "POST",
      body: form,
      headers: form.getHeaders()
    })

    if (!res.ok) throw await res.text()

    let buffer = Buffer.from(await res.arrayBuffer())

    await conn.sendMessage(
      m.chat,
      { image: buffer, caption: "✨ Imagen mejorada en HD" },
      { quoted: m }
    )

  } catch (e) {
    console.error("Upscale error:", e)
    m.reply("⚠️ Error al mejorar la imagen, inténtalo más tarde.")
  }
}

handler.command = /^hd$/i
handler.help = ["hd"]
handler.tags = ["tools"]

export default handler