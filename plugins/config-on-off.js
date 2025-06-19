import fs from 'fs';

const settingsPath = './settings.json';

let handler = async (m, { conn, usedPrefix, command, args, isOwner }) => {
    const setting = args[0]?.toLowerCase();
    if (!setting) {
        throw `⚠️ Especifica la configuración que deseas cambiar.\n\nUso: *${usedPrefix + command} <welcome/bye/nsfw/arabkick>*`;
    }

    const validSettings = ['welcome', 'bye', 'nsfw', 'arabkick'];
    if (!validSettings.includes(setting)) {
        throw `⚠️ Configuración no válida.\n\nOpciones disponibles:\n- welcome\n- bye\n- nsfw\n- arabkick`;
    }

    // Determinar acción (activar/desactivar)
    const action = command === 'on';

    // Cargar settings
    let settings = {};
    if (fs.existsSync(settingsPath)) {
        settings = JSON.parse(fs.readFileSync(settingsPath));
    }

    const key = isOwner ? 'global' : m.chat;
    if (!settings[key]) settings[key] = {};
    settings[key][setting] = action;

    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    m.reply(`✅ La configuración *${setting}* ha sido ${action ? 'activada' : 'desactivada'} correctamente ${isOwner ? 'globalmente' : 'para este grupo'}.`);
};

handler.help = ['on <setting>', 'off <setting>'];
handler.tags = ['group', 'config'];
handler.command = ['on', 'off'];
handler.admin = true;
handler.group = true;

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