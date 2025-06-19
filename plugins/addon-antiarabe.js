import fs from 'fs';

const settingsPath = './settings.json';

// Regex para letras árabes
const arabRegex = /[اأإآبتثجحخدذرزسشصضطظعغفقكلمنهوي]/;
// Códigos de país árabes
const arabCodes = ['212', '213', '216', '218', '20', '966', '971', '962', '963', '964', '965', '967', '968', '970', '972', '973', '974', '975', '976', '977'];

let handler = async (m, { conn }) => {
  if (!m.isGroup) return;

  const settings = fs.existsSync(settingsPath) ? JSON.parse(fs.readFileSync(settingsPath)) : {};
  const isGroupEnabled = settings[m.chat]?.arabkick === true;
  const isGlobalEnabled = settings.global?.arabkick === true;

  if (!isGroupEnabled && !isGlobalEnabled) return;

  const groupMetadata = await conn.groupMetadata(m.chat);
  const participants = groupMetadata.participants.map(p => p.id);

  for (const jid of participants) {
    const number = jid.split('@')[0];
    const isArabUser = arabRegex.test(number) || arabCodes.some(code => number.startsWith(code));

    if (isArabUser) {
      try {
        await conn.groupParticipantsUpdate(m.chat, [jid], 'remove');
        await conn.sendMessage(m.chat, {
          text: `🚫 Usuario @${number} fue expulsado automáticamente por coincidencia con perfil árabe.`,
          mentions: [jid]
        });
      } catch (e) {
        console.error('Error al expulsar usuario existente:', e);
      }
    }
  }
};

// También se ejecuta en entrada de nuevos miembros
handler.groupParticipantsUpdate = async ({ id, participants, conn }) => {
  const settings = fs.existsSync(settingsPath) ? JSON.parse(fs.readFileSync(settingsPath)) : {};
  const isGroupEnabled = settings[id]?.arabkick === true;
  const isGlobalEnabled = settings.global?.arabkick === true;

  if (!isGroupEnabled && !isGlobalEnabled) return;

  for (const jid of participants) {
    const number = jid.split('@')[0];
    const isArabUser = arabRegex.test(number) || arabCodes.some(code => number.startsWith(code));

    if (isArabUser) {
      try {
        await conn.groupParticipantsUpdate(id, [jid], 'remove');
        await conn.sendMessage(id, {
          text: `🚫 Usuario @${number} fue expulsado automáticamente.`,
          mentions: [jid]
        });
      } catch (e) {
        console.error('Error al expulsar nuevo usuario:', e);
      }
    }
  }
};

export default handler;
