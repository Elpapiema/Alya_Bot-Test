import fs from 'fs'

const WARN_PATH = './database/warns.json'
const SETTINGS_PATH = './settings.json'

// Leer configuración
function loadSettings() {
  if (!fs.existsSync(SETTINGS_PATH)) return { global: {} }
  return JSON.parse(fs.readFileSync(SETTINGS_PATH))
}

// Leer advertencias
function loadWarns() {
  if (!fs.existsSync(WARN_PATH)) fs.writeFileSync(WARN_PATH, '{}')
  return JSON.parse(fs.readFileSync(WARN_PATH))
}

// Guardar advertencias
function saveWarns(data) {
  fs.writeFileSync(WARN_PATH, JSON.stringify(data, null, 2))
}

export async function before(m, { conn, isOwner }) {
  const settings = loadSettings()
  const antiprivado = settings?.global?.antiprivado

  // Verificaciones
  if (!antiprivado) return
  if (m.isGroup) return
  if (isOwner) return

  const warns = loadWarns()
  const id = m.sender
  warns[id] = (warns[id] || 0) + 1

  // Responder según advertencia
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
