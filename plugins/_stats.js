let handler = async (m, { conn, command }) => {
  if (!m || !m.text) return
  if (!m.isCommand) return // Solo para comandos

  try {
    // Siempre envía señal de "escribiendo"
    await conn.sendPresenceUpdate('composing', m.chat)

    // Solo para comandos específicos: play y play2
    const cmd = command?.toLowerCase()
    if (cmd === 'play' || cmd === 'play2') {
      setTimeout(() => {
        conn.sendPresenceUpdate('recording', m.chat)
      }, 1000)
    }

  } catch (e) {
    console.error('[❌ Error en presencia automática]', e)
  }
}

// Plugin automático (sin comando explícito)
handler.customPrefix = /^/
handler.command = new RegExp // Captura todo
handler.before = true // Se ejecuta antes que el plugin principal

export default handler
