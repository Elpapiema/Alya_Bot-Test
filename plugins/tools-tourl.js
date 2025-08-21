// plugins/tool-tourl.js
import uploadQuax from '../lib/qu.ax-uploader.js'

let handler = async (m, { conn }) => {
  // Verificar si el mensaje contiene o responde a una imagen
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime || !mime.startsWith('image/')) {
    return m.reply('⚠️ Responde a una imagen o envía una con el comando *tourl*')
  }

  try {
    // Descargar la imagen
    let buffer = await q.download()

    // Subir a qu.ax
    let url = await uploadQuax(buffer)

    // Responder con el link
    await m.reply(`✅ Imagen subida:\n${url}`)
  } catch (err) {
    console.error(err)
    m.reply('❌ Error al subir la imagen, inténtalo más tarde.')
  }
}

handler.command = /^tourl$/i
handler.help = ['tourl']
handler.tags = ['tools']

export default handler
