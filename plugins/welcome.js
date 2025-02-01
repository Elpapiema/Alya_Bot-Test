import { WAMessageStubType } from '@whiskeysockets/baileys'; // Asegúrate de importar correctamente
import fetch from 'node-fetch'; // Para obtener imágenes de perfil

export async function before(m, { conn, groupMetadata }) {
  // Verificar si el mensaje es un evento de grupo y si es de tipo bienvenida (27) o despedida (28, 32)
  if (!m.messageStubType || !m.isGroup) return;

  // Obtener la foto de perfil del usuario
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://telegra.ph/file/2a1d71ab744b55b28f1ae.jpg');
  let img = await (await fetch(pp)).buffer();

  // Obtener el nombre del usuario
  let usuario = `@${m.messageStubParameters[0].split('@')[0]}`;

  // Obtener metadatos del grupo
  let subject = groupMetadata.subject; // Nombre del grupo
  let descs = groupMetadata.desc || "*Descripción predeterminada del grupo*"; // Descripción del grupo

  // Mensaje de bienvenida personalizado
  if (m.messageStubType == 27) { // Evento de entrada al grupo
    let textWel = `
┏━━━━━━━━━━━━
┃──〘 *BIENVENIDO/A* 〙──
┃━━━━━━━━━━━━
┃ *Hola ${usuario} 👋 Bienvenido/a a*
┃ *_${subject} ✨_*
┃
┃=> *_En este grupo podrás_*
┃ *_encontrar:_*
┠⊷ *Amistades 🫂*
┠⊷ *Desmadre 💃🕺*
┠⊷ *Relajo 💅*
┠⊷ *Un Bot Sexy 🤖*
┃
┃=> *_Puedes solicitar mi lista de_*
┃ *_comandos con:_*
┠⊷ *#menu*
┃
┃=> *_Aquí tienes la descripción_*
┃ *_del grupo, léela!!_*
┃
${descs}
┃
┃ *_🥳 Disfruta de tu_*
┃ *_estadía en el grupo 🥳_*
┃
┗━━━━━━━━━━━`;

    await conn.sendMessage(m.chat, {
      image: img, // Envía la foto de perfil del usuario
      caption: textWel,
      mentions: [m.sender, m.messageStubParameters[0]] // Menciona al usuario
    });
  }

  // Mensaje de despedida personalizado
  else if (m.messageStubType == 28 || m.messageStubType == 32) { // Evento de salida del grupo
    let textBye = `
┏━━━━━━━━━━━━
┃──〘 *ADIOS* 〙───
┃━━━━━━━━━━━━
┃ *_☠ Se fue ${usuario}_*
┃ *_Que dios lo bendiga️_*
┃ *_Y lo atropelle un tren 😇_*
┗━━━━━━━━━━`;

    await conn.sendMessage(m.chat, {
      image: img, // Envía la foto de perfil del usuario
      caption: textBye,
      mentions: [m.sender, m.messageStubParameters[0]] // Menciona al usuario
    });
  }
}