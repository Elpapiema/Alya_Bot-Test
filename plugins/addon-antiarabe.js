import fs from 'fs';

const settingsPath = './settings.json';

// Lista de prefijos internacionales árabes comunes
const arabCountryCodes = [
  '212', '213', '216', '218', '20', '964', '966', '967', '968', '971', '972', '973', '974', '975', '976', '961'
];

// Palabras o caracteres comunes árabes (en Unicode o nombre)
const arabicPattern = /[\u0600-\u06FF]|arab|الإسلام|محمد|الله/i;

export async function before(m, { conn }) {
  // Solo activarse cuando alguien entra
  if (!m.isGroup || !m.messageStubType || m.messageStubType !== 27) return;

  const settings = fs.existsSync(settingsPath)
    ? JSON.parse(fs.readFileSync(settingsPath))
    : { global: {}, groups: {} };

  const groupSetting = settings.groups?.[m.chat]?.arabKick;
  const globalSetting = settings.global?.arabKick;
  const isEnabled = groupSetting ?? globalSetting;

  if (!isEnabled) return;

  try {
    const groupMetadata = await conn.groupMetadata(m.chat);
    const botNumber = conn.user.jid;
    const botParticipant = groupMetadata.participants.find(p => p.id === botNumber);
    if (!botParticipant || !botParticipant.admin) return;

    for (const user of m.messageStubParameters) {
      const jid = user;
      const number = jid.split('@')[0];

      // Verificar por prefijos de países árabes
      const startsWithArabCode = arabCountryCodes.some(code => number.startsWith(code));

      // Verificar si el nombre contiene caracteres árabes
      const name = await conn.getName(jid);
      const isArabicName = arabicPattern.test(name);

      if (startsWithArabCode || isArabicName) {
        await conn.groupParticipantsUpdate(m.chat, [jid], 'remove');
        await conn.sendMessage(m.chat, { text: `🚫 Usuario sospechoso de spam árabe eliminado: @${number}`, mentions: [jid] });
      }
    }
  } catch (e) {
    console.error('Error en auto-expulsión árabe:', e);
  }
}
