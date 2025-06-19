import fs from 'fs';

const settingsPath = './settings.json';

const arabRegex = /[اأإآبتثجحخدذرزسشصضطظعغفقكلمنهوي]/;
const arabicCountries = ['212', '213', '216', '218', '20', '966', '971', '962', '963', '964', '965', '967', '968', '970', '971', '972', '973', '974', '975', '976', '977'];

let handler = async (m, { conn }) => {
  if (!m.isGroup || !m.messageStubType || !m.messageStubParameters) return;

  const stubType = m.messageStubType;
  if (stubType !== 27 && stubType !== 28) return; // 27: user joined, 28: user added

  const settings = fs.existsSync(settingsPath)
    ? JSON.parse(fs.readFileSync(settingsPath))
    : {};

  const groupSettings = settings[m.chat] || {};
  const globalSettings = settings.global || {};
  const arabKickEnabled = groupSettings.arabkick || globalSettings.arabkick;

  if (!arabKickEnabled) return;

  const participants = m.messageStubParameters;
  for (const jid of participants) {
    try {
      const number = jid.split('@')[0];
      const isArab = arabRegex.test(number) || arabicCountries.some(code => number.startsWith(code));
      if (isArab) {
        await conn.groupParticipantsUpdate(m.chat, [jid], 'remove');
        await conn.sendMessage(m.chat, { text: `⚠️ Usuario ${number} fue eliminado por coincidir con patrones árabes.` });
      }
    } catch (e) {
      console.error(`Error al intentar expulsar a ${jid}:`, e);
    }
  }
};

export default handler;
