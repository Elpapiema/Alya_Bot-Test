function handler() {}

handler.before = async function (m, { conn, usedPrefix }) {
    if (!m || !m.text || !m.isCommand) return

    try {
        const body = m.text.trim()
        const prefix = usedPrefix
        const commandRaw = body.slice(prefix.length).split(' ')[0].toLowerCase()

        // Siempre enviar señal de "escribiendo"
        await conn.sendPresenceUpdate('composing', m.chat)

        // Enviar "grabando audio" solo para comandos play y play2
        if (['play', 'play2'].includes(commandRaw)) {
            setTimeout(() => {
                conn.sendPresenceUpdate('recording', m.chat)
            }, 1000)
        }

    } catch (error) {
        console.error(`❌ Error en el plugin de presencia automática: ${error.message}`)
    }
}

// Configuración del plugin
handler.customPrefix = /^/         // Acepta todos los prefijos
handler.command = new RegExp       // Captura todos los comandos
handler.before = handler.before    // Se ejecuta antes de los comandos principales
handler.disabled = false           // Habilitado por defecto

export default handler
