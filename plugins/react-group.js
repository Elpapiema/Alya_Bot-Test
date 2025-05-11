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
]

const handler = async (m, { conn, text }) => {
  const quoted = m.quoted
  if (!quoted) return m.reply("❌ Debes responder (citar) un mensaje para reaccionar.")

  const parts = text.split(',').map(v => v.trim())
  if (parts.length < 1) {
    return m.reply(`Formato incorrecto.\nEjemplo:\n.reactg <texto>,<número de fuente>\n\nFuentes disponibles:\n0: Cuadrada\n1: Negras`)
  }

  const msg = parts[0].toLowerCase()
  const fontIndex = parseInt(parts[1] || 0)

  if (isNaN(fontIndex) || fontIndex >= fonts.length || fontIndex < 0) {
    return m.reply("❌ Fuente inválida. Usa un número entre 0 y " + (fonts.length - 1))
  }

  const font = fonts[fontIndex]
  const emoji = msg.split('').map(c => c === ' ' ? '―' : (font[c] || c)).join('')

  try {
    await conn.sendMessage(m.chat, {
      react: {
        text: emoji,
        key: quoted.key
      }
    })
    m.reply(`✅ Reacción *${emoji}* enviada usando fuente ${fontIndex}.`)
  } catch (e) {
    console.error(e)
    m.reply("❌ Error al reaccionar al mensaje.")
  }
}

handler.command = ['reactg', 'rg']
handler.tags = ['tools']
handler.help = ['reactg <texto>,<número de fuente>']
handler.owner = true

export default handler