let handler = async (m, { conn, participants, groupMetadata, isAdmin, isBotAdmin, command, usedPrefix }) => {
  if (!m.isGroup) throw `🚫 Este comando solo puede usarse en grupos`
  if (!isAdmin) throw `❌ Solo los administradores pueden usar este comando`
  //if (!isBotAdmin) throw `⚠️ Debo ser administrador para poder promover a alguien`

  let user;
  if (m.mentionedJid.length > 0) {
    user = m.mentionedJid[0];
  } else if (m.quoted) {
    user = m.quoted.sender;
  } else {
    throw `✏️ Menciona o responde al mensaje del usuario que deseas hacer admin`;
  }

  const alreadyAdmin = groupMetadata.participants.find(p => p.id === user)?.admin;
  if (alreadyAdmin) throw `🔺 Ese usuario ya es administrador`;

  await conn.groupParticipantsUpdate(m.chat, [user], "promote");
  m.reply(`✅ Se ha promovido a @${user.split("@")[0]} como administrador`, null, {
    mentions: [user]
  });
};

handler.help = ['promote', 'promover', 'daradmin'];
handler.tags = ['group'];
handler.command = /^(promote|promover|daradmin)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = false;

export default handler;
