const fonts = [
  // Fuente 0: Cuadrada clásica (como la actual)
  {
    a: '🄰', b: '🄱', c: '🄲', d: '🄳', e: '🄴', f: '🄵', g: '🄶',
    h: '🄷', i: '🄸', j: '🄹', k: '🄺', l: '🄻', m: '🄼', n: '🄽',
    o: '🄾', p: '🄿', q: '🅀', r: '🅁', s: '🅂', t: '🅃', u: '🅄',
    v: '🅅', w: '🅆', x: '🅇', y: '🅈', z: '🅉'
  },
  // Fuente 1: Letras dobles negras (como el ejemplo)
  {
    a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
    h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
    o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
    v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩'
  }
  // Aquí podrías añadir más fuentes si lo deseas
]


const handler = async (m, { conn, text }) => {
  if (!text.includes('|')) {
    return m.reply(`Ejemplo:\n.reactch <link>|<texto>|<número de fuente>\n\nFuentes disponibles:\n0: Cuadrada\n1: Letras negras`)
  }

  let [link, rawText, fontIndex = 0] = text.split('|')
  link = link.trim()
  const msg = rawText.trim().toLowerCase()
  fontIndex = parseInt(fontIndex.trim())

  if (!link.startsWith("https://whatsapp.com/channel/")) {
    return m.reply("❌ Link no válido")
  }

  if (isNaN(fontIndex) || fontIndex >= fonts.length) {
    return m.reply("❌ Fuente inválida. Usa un número entre 0 y " + (fonts.length - 1))
  }

  const font = fonts[fontIndex]
  const emoji = msg.split('').map(c => c === ' ' ? '―' : (font[c] || c)).join('')

  try {
    const [, , , , channelId, messageId] = link.split('/')
    const res = await conn.newsletterMetadata("invite", channelId)
    await conn.newsletterReactMessage(res.id, messageId, emoji)
    m.reply(`✅ Reacción *${emoji}* Enviada a *${res.name}* con fuente ${fontIndex}.`)
  } catch (e) {
    console.error(e)
    m.reply("❌ Error!")
  }
}

handler.command = ['reactch', 'rch']
handler.tags = ['tools']
handler.help = ['reactch <link>|<texto>|<número de fuente>']
handler.owner = true

export default handler