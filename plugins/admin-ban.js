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
  // Obtener metadata del grupo
  const groupMetadata = await conn.groupMetadata(m.chat);
  const groupAdmins = groupMetadata.participants
    .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
    .map(p => p.id);

  // Verificar si el usuario es admin
  if (!isAdmin) {
    return m.reply('❌ Este comando es solo para administradores.');
  }

  // Verificar si el bot es admin (detección avanzada)
  const botNumber = conn.decodeJid(conn.user?.id || '').replace(/:.*$/, '');
  const botParticipant = groupMetadata.participants.find(p => {
    const participantJid = conn.decodeJid(p.id).replace(/:.*$/, '');
    return participantJid === botNumber || participantJid.endsWith(botNumber);
  });

  const isBotAdmin = botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin';
  if (!isBotAdmin) {
    return m.reply('❌ Necesito ser administrador para ejecutar esta acción.');
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
    return m.reply('❌ Menciona, responde o escribe el número del usuario que deseas expulsar.');
  }

  // Verificar si está en el grupo
  const isMember = participants.find(p => p.id === target);
  if (!isMember) return m.reply('❌ El usuario no es miembro del grupo.');

  // Verificar si es admin
  if (groupAdmins.includes(target)) return m.reply('❌ No puedes expulsar a un administrador.');

  // Ejecutar expulsión
  try {
    await conn.groupParticipantsUpdate(m.chat, [target], 'remove');
    m.reply(`✅ El usuario @${target.split('@')[0]} ha sido expulsado del grupo.`, null, { mentions: [target] });
  } catch (err) {
    m.reply(`❌ Error al intentar expulsar al usuario: ${err.message}`);
  }
};

// Configuración del handler
handler.command = /^(kick|ban)$/i;
handler.group = true;
handler.admin = true; // Solo admins pueden usarlo
handler.botAdmin = false; // El bot debe ser admin

export default handler;