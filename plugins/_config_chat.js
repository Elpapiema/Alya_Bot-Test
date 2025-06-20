import fs from 'fs';

const settingsPath = './settings.json';

let handler = async (m, { conn, isOwner, isAdmin, isGroup }) => {
    if (!isOwner && !isAdmin) {
        throw '❌ Este comando solo puede ser usado por *administradores* del grupo o *owners*.';
    }

    // Cargar configuración
    let settings = {};
    if (fs.existsSync(settingsPath)) {
        settings = JSON.parse(fs.readFileSync(settingsPath));
    }

    const groupId = m.chat;
    const globalConfig = settings.global || {};
    const groupConfig = (settings.groups && settings.groups[groupId]) || {};

    // Construir respuesta
    let response = '';

    if (isOwner) {
        response += '🌐 *Configuraciones Globales:*\n';
        if (Object.keys(globalConfig).length === 0) {
            response += '_No hay configuraciones globales definidas._\n';
        } else {
            for (let key in globalConfig) {
                response += `- ${key}: ${globalConfig[key] ? '✅ Activado' : '❌ Desactivado'}\n`;
            }
        }
        response += '\n';
    }

    if (isGroup && (isOwner || isAdmin)) {
        response += `👥 *Configuraciones del Grupo:* (${groupId})\n`;
        if (Object.keys(groupConfig).length === 0) {
            response += '_No hay configuraciones para este grupo._\n';
        } else {
            for (let key in groupConfig) {
                response += `- ${key}: ${groupConfig[key] ? '✅ Activado' : '❌ Desactivado'}\n`;
            }
        }
    }

    m.reply(response.trim());
};

handler.help = ['settings'];
handler.tags = ['group', 'config'];
handler.command = ['settings'];
handler.admin = true;

export default handler;

