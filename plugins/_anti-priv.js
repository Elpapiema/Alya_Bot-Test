import fs from 'fs'

// Rutas
const WARN_PATH = './database/warns.json'
const SETTINGS_PATH = './settings.json'

// Cargar advertencias
function loadWarns() {
  if (!fs.existsSync(WARN_PATH)) fs.writeFileSync(WARN_PATH, '{}')
  return JSON.parse(fs.readFileSync(WARN_PATH))
}

// Guardar advertencias
function saveWarns(data) {
  fs.writeFileSync(WARN_PATH, JSON.stringify(data, null, 2))
}

// Cargar configuración
function loadSettings() {
  if (!fs.existsSync(SETTINGS_PATH)) return { global: {} }
  return JSON.parse(fs.readFileSync(SETTINGS_PATH))
}

const handler = async (m, { conn, isOwner }) => {
  const settings = loadSettings()
  const antiprivado = settings?.global?.antiprivado

  if (!antiprivado) return // función desactivada
  if (m.isGroup) return // ignorar en grupos
  if (isOwner) return // permitir a dueños

  const warns = loadWarns()
  const id = m.sender

  warns[id] = (warns[id] || 0) + 1

  if (warns[id] >= 3) {
    await conn.sendMessage(id, {
      text: '🚫 Has sido bloqueado por contactar al bot en privado sin autorización.'
    })
    await conn.updateBlockStatus(id, 'block')
  } else {
    await conn.sendMessage(id, {
      text: `⚠️ No puedes contactar al bot en privado.\nAdvertencia ${warns[id]} de 3.`
    })
  }

  saveWarns(warns)
}

handler.before = true // interceptar antes que otros
handler.private = true // solo en chats privados

export default handler
