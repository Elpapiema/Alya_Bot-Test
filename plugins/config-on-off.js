import fs from 'fs';
const settingsPath = './settings.json';

let handler = async (m, { conn, command, isAdmin, isOwner, isGroup }) => {
  if (!isAdmin && !isOwner) return m.reply('❌ Este comando solo puede ser usado por administradores o dueños del bot.');

  const activate = command === 'on';
  const settings = fs.existsSync(settingsPath) ? JSON.parse(fs.readFileSync(settingsPath)) : { global: {}, groups: {} };

  if (isGroup && !isOwner) {
    // Configuración por grupo
    settings.groups[m.chat] = settings.groups[m.chat] || {};
    settings.groups[m.chat].arabKick = activate;
    m.reply(`🛡️ Expulsión automática de árabes ${activate ? '*activada*' : '*desactivada*'} para este grupo.`);
  } else if (isOwner) {
    // Configuración global
    settings.global.arabKick = activate;
    m.reply(`🌐 Expulsión automática de árabes ${activate ? '*activada globalmente*' : '*desactivada globalmente*'}.`);
  } else {
    m.reply('❌ Solo los dueños del bot pueden hacer cambios globales.');
  }

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
};

handler.command = /^(on|off)$/i;
handler.group = true;
//handler.private = true;
handler.tags = ['owner'];
handler.help = ['on', 'off'];

export default handler;




/*let handler = async (m, { conn, usedPrefix, command, args }) => {
    const chat = global.db.data.chats[m.chat];
    if (!chat) throw `⚠️ Este comando solo puede usarse en grupos.`;

    // Argumento esperado: nombre de la configuración
    const setting = args[0]?.toLowerCase();
    if (!setting) throw `⚠️ Especifica la configuración que deseas cambiar.\n\nUso: *${usedPrefix + command} <welcome/bye>*`;

    // Configuraciones permitidas
    const validSettings = ['welcome', 'bye', 'nsfw'];
    if (!validSettings.includes(setting)) {
        throw `⚠️ Configuración no válida.\n\nOpciones disponibles:\n- welcome\n- bye`;
    }

    // Determinar acción (activar/desactivar)
    const action = command === 'on';
    chat[setting] = action;

    m.reply(`✅ La configuración *${setting}* ha sido ${action ? 'activada' : 'desactivada'} correctamente.`);
};

handler.help = ['on <setting>', 'off <setting>'];
handler.tags = ['group', 'config'];
handler.command = ['on', 'off'];
handler.admin = true; // Solo administradores pueden cambiar configuraciones
handler.group = true; // Solo se permite en grupos

export default handler;*/