let handler = async (m, { conn, participants, groupMetadata, isAdmin, isBotAdmin, command, usedPrefix }) => {
  if (!m.isGroup) throw `🚫 Este comando solo puede usarse en grupos`
  if (!isAdmin) throw `❌ Solo los administradores pueden usar este comando`
  //if (!isBotAdmin) throw `⚠️ Debo ser administrador para poder degradar a alguien`

  let user;
  if (m.mentionedJid.length > 0) {
    user = m.mentionedJid[0];
  } else if (m.quoted) {
    user = m.quoted.sender;
  } else {
    throw `✏️ Menciona o responde al mensaje del usuario que deseas quitar como admin`;
  }

  const isTargetAdmin = groupMetadata.participants.find(p => p.id === user)?.admin;
  if (!isTargetAdmin) throw `⚠️ Ese usuario no es administrador`;

  await conn.groupParticipantsUpdate(m.chat, [user], "demote");
  m.reply(`🛑 Se ha removido el admin de @${user.split("@")[0]}`, null, {
    mentions: [user]
  });
};

handler.help = ['demote', 'quitaradmin', 'degradar'];
handler.tags = ['group'];
handler.command = /^(demote|quitaradmin|degradar)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = false;

export default handler;
