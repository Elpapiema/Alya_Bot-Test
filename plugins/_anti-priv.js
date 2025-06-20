import fs from 'fs'

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

const handler = async (m, { conn, isOwner, isCommand }) => {
  const settings = loadSettings()
  const antiprivado = settings?.global?.antiprivado

  if (!antiprivado) return // función desactivada globalmente
  if (m.isGroup) return // solo aplica en privados
  if (isOwner) return // dueños pueden usar comandos en privado
  if (!isCommand) return // ignorar mensajes que no son comandos

  const warns = loadWarns()
  const id = m.sender

  warns[id] = (warns[id] || 0) + 1

  if (warns[id] >= 3) {
    await conn.sendMessage(id, {
      text: '⛔ Has sido bloqueado por usar comandos en privado sin permiso.'
    })
    await conn.updateBlockStatus(id, 'block')
  } else {
    await conn.sendMessage(id, {
      text: `⚠️ No está permitido usar comandos en privado. Advertencia ${warns[id]} de 3.\nEvita ser bloqueado.`
    })
  }

  saveWarns(warns)
}

handler.customPrefix = /^./ // interceptar comandos
handler.before = true // ejecutarse antes de otros plugins
handler.group = false // aplicar solo en privados

export default handler
