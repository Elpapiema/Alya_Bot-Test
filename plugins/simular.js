import { proto } from '@whiskeysockets/baileys';

const handler = async (m, { command, conn, text, args }) => {
  const groupName = text || "Grupo Simulado"; // Nombre del grupo por defecto
  const fakeUser = "123456789@s.whatsapp.net"; // Usuario simulado
  const fakeParticipants = [{ id: fakeUser }];

  if (command === "simular" || command === "simulate") {
    switch (args[0]?.toLowerCase()) {
      case "gpsalida":
        await conn.ev.emit('groups.update', [
          { id: m.chat, subject: groupName, action: "user-leave", participants: fakeParticipants },
        ]);
        await m.reply(`Simulación completada: Salida de un usuario en el grupo "${groupName}".`);
        break;

      case "gpentrada":
        await conn.ev.emit('groups.update', [
          { id: m.chat, subject: groupName, action: "user-add", participants: fakeParticipants },
        ]);
        await m.reply(`Simulación completada: Entrada de un usuario en el grupo "${groupName}".`);
        break;

      default:
        await m.reply(
          `Uso del comando:\n` +
          `• .simular gpsalida - Simula la salida de un usuario del grupo\n` +
          `• .simular gpentrada - Simula la entrada de un usuario al grupo`
        );
        break;
    }
  }
};

handler.command = ["simular", "simulate"]; // Define los comandos
export default handler;