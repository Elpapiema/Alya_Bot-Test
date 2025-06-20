import fs from 'fs';

const settingsPath = './settings.json';

let handler = async (m, { conn, usedPrefix, command, args, isOwner, isGroup }) => {
    const setting = args[0]?.toLowerCase();
    if (!setting) {
        throw `⚠️ Especifica la configuración que deseas cambiar.\n\nUso: *${usedPrefix + command} <welcome/bye/nsfw/arabkick/antiprivado>*`;
    }

    const validSettings = ['welcome', 'nsfw', 'arabkick'];
    const globalOnly = ['antiprivado'];

    if (!validSettings.includes(setting)) {
        throw `⚠️ Configuración no válida.\n\nOpciones disponibles:\n- welcome\n- bye\n- nsfw\n- arabkick\n- antiprivado`;
    }

    const action = command === 'on'; // true = activar, false = desactivar

    // Cargar settings
    let settings = {};
    if (fs.existsSync(settingsPath)) {
        settings = JSON.parse(fs.readFileSync(settingsPath));
    }

    // Determinar si es global o por grupo
    let scope = '';
    if (globalOnly.includes(setting)) {
        if (!isOwner) throw `❌ La configuración *${setting}* solo puede ser cambiada por el owner.`;
        scope = 'global';
        if (!settings.global) settings.global = {};
        settings.global[setting] = action;
    } else if (isGroup) {
        // En grupo, se aplica a settings.groups[chatId]
        if (!settings.groups) settings.groups = {};
        if (!settings.groups[m.chat]) settings.groups[m.chat] = {};
        settings.groups[m.chat][setting] = action;
        scope = `el grupo *${m.chat}*`;
    } else if (isOwner && !isGroup) {
        // En privado, pero el owner: configuración global
        if (!settings.global) settings.global = {};
        settings.global[setting] = action;
        scope = 'globalmente';
    } else {
        throw `❌ Solo el *owner* puede aplicar configuraciones globales desde un chat privado.`;
    }

    // Guardar cambios
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    m.reply(`✅ La configuración *${setting}* ha sido ${action ? 'activada' : 'desactivada'} correctamente ${scope}.`);
};

handler.help = ['on <config>', 'off <config>'];
handler.tags = ['group', 'config'];
handler.command = ['on', 'off'];
handler.admin = true;

export default handler;



/*import fs from 'fs';

const settingsPath = './settings.json';

let handler = async (m, { conn, usedPrefix, command, args, isOwner }) => {
    const setting = args[0]?.toLowerCase();
    if (!setting) {
        throw `⚠️ Especifica la configuración que deseas cambiar.\n\nUso: *${usedPrefix + command} <welcome/bye/nsfw/arabkick>*`;
    }

    const validSettings = ['welcome', 'bye', 'nsfw', 'arabkick', 'antiprivado'];
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
//handler.group = true;

export default handler;*/
