const fonts = [
  // Fuente 0: Cuadrada
  {
    a: '🄰', b: '🄱', c: '🄲', d: '🄳', e: '🄴', f: '🄵', g: '🄶',
    h: '🄷', i: '🄸', j: '🄹', k: '🄺', l: '🄻', m: '🄼', n: '🄽',
    o: '🄾', p: '🄿', q: '🅀', r: '🅁', s: '🅂', t: '🅃', u: '🅄',
    v: '🅅', w: '🅆', x: '🅇', y: '🅈', z: '🅉'
  },
  // Fuente 1: Letras negras (dobles)
  {
    a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
    h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
    o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
    v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩'
  }
  // Puedes seguir agregando más estilos si quieres
]

const handler = async (m, { conn, text }) => {
  if (!text.includes(',')) {
    return m.reply(`Formato incorrecto.\nEjemplo:\n.reactch <link>,<texto>,<número de fuente>\n\nFuentes disponibles:\n0: Cuadrada\n1: Negras`)
  }

  const parts = text.split(',').map(v => v.trim())
  if (parts.length < 2) return m.reply("Faltan argumentos. Asegúrate de usar: link,texto[,fuente]")

  const link = parts[0]
  const msg = parts[1].toLowerCase()
  const fontIndex = parseInt(parts[2] || 0)

  if (!link.startsWith("https://whatsapp.com/channel/")) {
    return m.reply("❌ Link no válido")
  }

  if (isNaN(fontIndex) || fontIndex >= fonts.length || fontIndex < 0) {
    return m.reply("❌ Fuente inválida. Usa un número entre 0 y " + (fonts.length - 1))
  }

  const font = fonts[fontIndex]
  const emoji = msg.split('').map(c => c === ' ' ? '―' : (font[c] || c)).join('')

  try {
    const [, , , , channelId, messageId] = link.split('/')
    const res = await conn.newsletterMetadata("invite", channelId)
    await conn.newsletterReactMessage(res.id, messageId, emoji)
    m.reply(`✅ Reacción *${emoji}* enviada a *${res.name}* usando fuente ${fontIndex}.`)
  } catch (e) {
    console.error(e)
    m.reply("❌ Error al enviar la reacción.")
  }
}

handler.command = ['reactch', 'rch']
handler.tags = ['tools']
handler.help = ['reactch <link>,<texto>,<número de fuente>']
handler.owner = true

export default handler