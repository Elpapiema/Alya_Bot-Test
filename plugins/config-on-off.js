import fs from 'fs';

const settingsPath = './settings.json';

let handler = async (m, { conn, usedPrefix, command, args, isOwner, isGroup }) => {
    const setting = args[0]?.toLowerCase();
    if (!setting) {
        throw `⚠️ Especifica la configuración que deseas cambiar.\n\nUso: *${usedPrefix + command} <welcome/bye/nsfw/arabkick/antiprivado>*`;
    }

    const validSettings = ['welcome', 'bye', 'nsfw', 'arabkick'];
    const globalOnly = ['antiprivado'];

    if (!validSettings.includes(setting) && !globalOnly.includes(setting)) {
        throw `⚠️ Configuración no válida.\n\nOpciones disponibles:\n- welcome\n- bye\n- nsfw\n- arabkick\n- antiprivado`;
    }

    const action = command === 'on';

    // Cargar o inicializar configuración
    let settings = {};
    if (fs.existsSync(settingsPath)) {
        settings = JSON.parse(fs.readFileSync(settingsPath));
    } else {
        settings = {
            global: {
                welcome: true
            },
            groups: {}
        };
    }

    let scope = '';

    // Owner en privado → configuración global
    if (isOwner && !isGroup) {
        if (!settings.global) settings.global = {};
        settings.global[setting] = action;
        scope = 'globalmente';
    }

    // Grupo → verificar si es admin (puede ser owner también)
    else if (isGroup) {
        const groupMetadata = await conn.groupMetadata(m.chat);
        const participants = groupMetadata.participants || [];
        const adminIds = participants
            .filter(p => ['admin', 'superadmin'].includes(p.admin))
            .map(p => p.id);

        const isGroupAdmin = adminIds.includes(m.sender);

        if (!isGroupAdmin) {
            throw '❌ Solo los *administradores* del grupo pueden cambiar la configuración de grupo.';
        }

        if (globalOnly.includes(setting)) {
            throw `❌ La configuración *${setting}* solo puede ser cambiada por el owner en privado.`;
        }

        if (!settings.groups) settings.groups = {};
        if (!settings.groups[m.chat]) settings.groups[m.chat] = {};
        settings.groups[m.chat][setting] = action;
        scope = `en el grupo *${m.chat}*`;
    }

    // No permitido
    else {
        throw '❌ Solo los administradores del grupo o el owner (en privado) pueden usar este comando.';
    }

    // Guardar cambios
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    m.reply(`✅ La configuración *${setting}* ha sido ${action ? 'activada' : 'desactivada'} correctamente ${scope}.`);
};

handler.help = ['on <config>', 'off <config>'];
handler.tags = ['group', 'config'];
handler.command = ['on', 'off'];

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
