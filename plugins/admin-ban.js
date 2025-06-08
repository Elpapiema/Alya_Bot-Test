/*const handler = async (m, { conn, text, participants, quoted, isAdmin, isBotAdmin }) => {
    const groupMetadata = await conn.groupMetadata(m.chat);
    const groupAdmins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id);

    // Verificar si el usuario es admin
    if (!isAdmin) {
        return m.reply('❌ Este comando es solo para Admins.');
    }

    // Verificar si el bot es admin
    if (!isBotAdmin) {
        return m.reply('❌ Necesito ser Admin para que puedas usar este comando.');
    }

    // Obtener el usuario objetivo
    let target;
    if (m.mentionedJid.length > 0) {
        // Si se mencionó a alguien
        target = m.mentionedJid[0];
    } else if (quoted) {
        // Si se respondió a un mensaje
        target = quoted.sender;
    } else if (text) {
        // Si se especificó un número directamente
        target = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else {
        return m.reply('❌ Por favor, menciona o responde a un usuario para expulsarlo.');
    }

    // Validar si el objetivo está en el grupo
    const isMember = participants.find(p => p.id === target);
    if (!isMember) return m.reply('❌ El usuario no es miembro del grupo.');

    // Verificar que no sea un administrador
    if (groupAdmins.includes(target)) return m.reply('❌ No puedes expulsar a un administrador.');

    try {
        // Expulsar al usuario
        await conn.groupParticipantsUpdate(m.chat, [target], 'remove');
        m.reply(`✅ El usuario @${target.split('@')[0]} ha sido expulsado del grupo.`, null, { mentions: [target] });
    } catch (err) {
        m.reply(`❌ Error al intentar expulsar al usuario: ${err.message}`);
    }
};

// Configuración del handler
handler.command = /^(kick|ban)$/i;
handler.group = true; // Solo funciona en grupos
handler.admin = true; // Solo los administradores pueden usarlo
handler.botAdmin = true; // El bot debe ser administrador

export default handler;*/

const handler = async (m, { conn, text, participants, quoted, isAdmin }) => {
    const groupMetadata = await conn.groupMetadata(m.chat);
    const groupAdmins = groupMetadata.participants
        .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
        .map(p => p.id);

    // Verificar si el usuario es admin
    if (!isAdmin) {
        return m.reply('❌ Este comando es solo para Admins.');
    }

    // 🔧 Calcular isBotAdmin de forma manual (compatible con @lid)
    const botNumber = conn.decodeJid(conn.user?.id || '');
    const botParticipant = groupMetadata.participants.find(p =>
        [botNumber, botNumber.replace(/@s\.whatsapp\.net$/, '@lid'), botNumber.replace(/@lid$/, '@s.whatsapp.net')].includes(conn.decodeJid(p.id))
    );
    const isBotAdmin = botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin';

    if (!isBotAdmin) {
        return m.reply('❌ Necesito ser Admin para que puedas usar este comando.');
    }

    // Obtener el usuario objetivo
    let target;
    if (m.mentionedJid.length > 0) {
        target = m.mentionedJid[0];
    } else if (quoted) {
        target = quoted.sender;
    } else if (text) {
        target = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else {
        return m.reply('❌ Por favor, menciona o responde a un usuario para expulsarlo.');
    }

    // Validar si el objetivo está en el grupo
    const isMember = participants.find(p => p.id === target);
    if (!isMember) return m.reply('❌ El usuario no es miembro del grupo.');

    // Verificar que no sea un administrador
    if (groupAdmins.includes(target)) return m.reply('❌ No puedes expulsar a un administrador.');

    try {
        await conn.groupParticipantsUpdate(m.chat, [target], 'remove');
        m.reply(`✅ El usuario @${target.split('@')[0]} ha sido expulsado del grupo.`, null, { mentions: [target] });
    } catch (err) {
        m.reply(`❌ Error al intentar expulsar al usuario: ${err.message}`);
    }
};

handler.command = /^(kick|ban)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = false; // ⚠️ Importante: desactiva la validación interna

export default handler;