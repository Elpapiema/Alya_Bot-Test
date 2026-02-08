import fs from 'fs'

let handler = async (m, { conn, text, args, usedPrefix }) => {
  // Validar grupo
 // if (!m.isGroup) throw `❌ *Este comando solo funciona en grupos.*`

  // Validar admin o owner
  //const isAdmin = m.isAdmin || m.isGroupAdmin || m.sender && global.owner && global.owner.includes(m.sender)
//  if (!isAdmin) throw `🚫 Solo los *administradores* (o owners) pueden usar este comando.`

  // Validar texto
  if (!text) throw `
🌸 Bienvenida personalizada

Escribe tu mensaje como quieras.
Puedes usar estas palabras si quieres datos automáticos:

- @user → menciona al usuario

- @group → nombre del grupo

- @desc → descripción del grupo

⚠️ No es obligatorio usarlas, solo si quieres que aparezcan esos datos.

Ejemplo:
Hola @user 👋 bienvenido a @group ✨`

  // Ruta settings
  const PATH = './database/settings.json'
  let settings = JSON.parse(fs.readFileSync(PATH))

  // Si no existe la sección groups, crearla
  if (!settings.groups) settings.groups = {}

  const id = m.chat

  // Crear grupo si no existe
  if (!settings.groups[id]) settings.groups[id] = {}

  // Guardar msgWelcome SOLO en groups
  settings.groups[id].msgWelcome = text

  fs.writeFileSync(PATH, JSON.stringify(settings, null, 2))

  m.reply(`✨ *Mensaje de bienvenida actualizado*\n\n📌 Ahora usaré este mensaje cuando alguien entre:\n\n${text}`)
}

handler.help = ['setwelcome <texto>']
handler.tags = ['group']
handler.command = ['setwelcome']
handler.group = true // Solo grupos
handler.admin = true // Solo admins

export default handler
