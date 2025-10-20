import fs from 'fs'
import path from 'path'

const handler = async (m, { text, conn }) => {
  if (!text) return m.reply('⚠️ Uso correcto: #build <código>, <nombre_del_archivo.js>')

  // Separar el texto en código y nombre del archivo
  const parts = text.split(',')
  if (parts.length < 2) return m.reply('❌ Formato inválido.\nEjemplo: #build export default async (...) {}, test.js')

  const code = parts.slice(0, -1).join(',').trim() // todo lo anterior a la última coma
  const fileName = parts.pop().trim()

  if (!fileName.endsWith('.js')) return m.reply('⚠️ El nombre del archivo debe terminar en .js')

  const pluginsDir = path.join(process.cwd(), 'plugins')
  const filePath = path.join(pluginsDir, fileName)

  // Verificar que el directorio exista
  if (!fs.existsSync(pluginsDir)) fs.mkdirSync(pluginsDir, { recursive: true })

  try {
    // Guardar el código en el archivo
    await fs.promises.writeFile(filePath, code, 'utf-8')

    m.reply(`✅ Plugin creado correctamente:\n📁 *${fileName}*\n📂 Ubicación: /plugins/${fileName}`)
  } catch (err) {
    console.error(err)
    m.reply('❌ Error al crear el plugin:\n' + err.message)
  }
}

handler.command = /^build$/i
handler.owner = true // Solo el owner puede usarlo
handler.help = ['build <código>, <nombre.js>']
//handler.tags = ['owner']

export default handler
