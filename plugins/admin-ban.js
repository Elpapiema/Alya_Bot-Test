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
    return m.reply('❀ 𝑺𝒐𝒍𝒐 𝑨𝒅𝒎𝒊𝒏𝒊𝒔𝒕𝒓𝒂𝒅𝒐𝒓𝒆𝒔 𝑫𝒆𝒍 𝑮𝒓𝒖𝒑𝒐 𝒑𝒖𝒆𝒅𝒆𝒏 𝒉𝒂𝒄𝒆𝒓 𝒖𝒔𝒐 𝒅𝒆 𝑬𝒔𝒕𝒆 𝑪𝒐𝒎𝒂𝒏𝒅𝒐');
  }

  // Verificar si el bot es admin (detección avanzada)
  const botNumber = conn.decodeJid(conn.user?.id || '').replace(/:.*$/, '');
  const botParticipant = groupMetadata.participants.find(p => {
    const participantJid = conn.decodeJid(p.id).replace(/:.*$/, '');
    return participantJid === botNumber || participantJid.endsWith(botNumber);
  });

  const isBotAdmin = botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin';
  if (!isBotAdmin) {
    return m.reply('❀ 𝑷𝒂𝒓𝒂 𝑬𝒋𝒆𝒄𝒖𝒕𝒂𝒓 𝒆𝒔𝒕𝒆 𝑪𝒐𝒎𝒂𝒏𝒅𝒐 𝒑𝒓𝒊𝒎𝒆𝒓𝒐 𝑵𝒆𝒄𝒆𝒔𝒊𝒕𝒐 𝒔𝒆𝒓 𝑨𝒅𝒎𝒊𝒏 𝑫𝒆𝒍 𝒈𝒓𝒖𝒑𝒐');
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
    return m.reply('❀ 𝑹𝒆𝒔𝒑𝒐𝒏𝒅𝒆 𝒂 𝒖𝒏 𝑴𝒆𝒏𝒔𝒂𝒋𝒆 𝒐 𝒎𝒆𝒏𝒄𝒊𝒐𝒏𝒂 𝒄𝒐𝒏 @ 𝑨𝒍 𝒖𝒔𝒖𝒂𝒓𝒊𝒐 𝒒𝒖𝒆 𝑸𝒖𝒊𝒆𝒓𝒂 𝒆𝒙𝒑𝒖𝒍𝒔𝒂𝒓');
  }

  // Verificar si está en el grupo
  const isMember = participants.find(p => p.id === target);
  if (!isMember) return m.reply('❀ 𝑬𝒔𝒕𝒆 𝑼𝒔𝒖𝒂𝒓𝒊𝒐 𝒚𝒂 𝒏𝒐 𝒇𝒐𝒓𝒎𝒂 𝑷𝒂𝒓𝒕𝒆 𝒅𝒆𝒍 𝑮𝒓𝒖𝒑𝒐');

  // Verificar si es admin
  if (groupAdmins.includes(target)) return m.reply('❀ 𝑳𝒐 𝑺𝒊𝒆𝒏𝒕𝒐 𝒑𝒆𝒓𝒐 𝑵𝒐 𝒑𝒖𝒆𝒅𝒆𝒔 𝑬𝒙𝒑𝒖𝒍𝒔𝒂𝒓 𝒂 𝑼𝒏 𝑨𝒅𝒎𝒊𝒏 𝒅𝒆𝒍 𝑮𝒓𝒖𝒑𝒐');

  // Ejecutar expulsión
  try {
    await conn.groupParticipantsUpdate(m.chat, [target], 'remove');
    m.reply(`❀ @${target.split('@')[0]} 𝑯𝒂 𝑺𝒊𝒅𝒐 𝑬𝒙𝒑𝒖𝒍𝒔𝒂𝒅𝒐 𝑫𝒆𝒍 𝑮𝒓𝒖𝒑𝒐`, null, { mentions: [target] });
  } catch (err) {
    m.reply(`❀ 𝑯𝒂 𝑶𝒄𝒖𝒓𝒓𝒊𝒅𝒐 𝑼𝒏 𝑬𝒓𝒓𝒐𝒓 𝑨𝒍 𝑰𝒏𝒕𝒆𝒏𝒕𝒂𝒓 𝑬𝒙𝒑𝒖𝒍𝒔𝒂𝒓: ${err.message}`);
  }
};

// Configuración del handler
handler.command = /^(kick|ban)$/i;
handler.group = true;
handler.admin = true; // Solo admins pueden usarlo
handler.botAdmin = false; // El bot debe ser admin

export default handler;
