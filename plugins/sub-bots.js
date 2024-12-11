import { 
  useMultiFileAuthState, 
  DisconnectReason, 
  makeCacheableSignalKeyStore, 
  fetchLatestBaileysVersion 
} from global.baileys;

import qrcode from 'qrcode';
import NodeCache from 'node-cache';
import fs from 'fs';
import path from 'path';
import pino from 'pino';
import { exec } from 'child_process';
import { makeWASocket } from '../lib/simple.js';

if (!Array.isArray(global.conns)) {
  global.conns = [];
}

let handler = async (message, { conn, args, usedPrefix, command, isOwner }) => {
  const isCodeMode = args.some(arg => /(--code|code)/.test(arg.trim()));
  const targetJid = message.mentionedJid?.[0] || (message.fromMe ? conn.user.jid : message.sender);
  const targetId = targetJid.split('@')[0];

  if (!fs.existsSync(`./Alya-SubBots/${targetId}`)) {
    fs.mkdirSync(`./Alya-SubBots/${targetId}`, { recursive: true });
  }

  if (args[0] && isCodeMode) {
    args[0] = args[0].replace(/^--code$|^code$/, '').trim();
    const creds = JSON.parse(Buffer.from(args[0], "base64").toString("utf-8"));
    fs.writeFileSync(`./Alya-SubBots/${targetId}/creds.json`, JSON.stringify(creds, null, 2));
  }

  if (fs.existsSync(`./Alya-SubBots/${targetId}/creds.json`)) {
    const creds = JSON.parse(fs.readFileSync(`./Alya-SubBots/${targetId}/creds.json`));
    if (!creds.registered) {
      fs.unlinkSync(`./Alya-SubBots/${targetId}/creds.json`);
    }
  }

  const { version, isLatest } = await fetchLatestBaileysVersion();
  const msgRetry = () => {};
  const cache = new NodeCache();

  const { state, saveState } = await useMultiFileAuthState(`./Alya-SubBots/${targetId}`);

  const options = {
    logger: pino({ level: 'silent' }),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
    },
    msgRetryCache: cache,
    version,
    syncFullHistory: true,
    browser: isCodeMode ? ["Ubuntu", "Chrome", "110.0.5585.95"] : ["AlyaBot", "Chrome", "2.0.0"],
    getMessage: async () => ({ conversation: "AlyaBot-MD" }),
  };

  let socket = makeWASocket(options);
  socket.isInit = false;

  socket.ev.on('connection.update', async update => {
    const { connection, lastDisconnect, qr } = update;

    if (qr && !isCodeMode) {
      const qrImage = await qrcode.toBuffer(qr, { scale: 8 });
      const qrMessage = await conn.sendMessage(message.chat, {
        image: qrImage,
        caption: "🔰 *AlyaBot* 🔰\nEscanea este QR para convertirte en un sub bot.",
      }, { quoted: message });

      setTimeout(async () => {
        if (qrMessage?.key) {
          await conn.sendMessage(message.sender, { delete: qrMessage.key });
        }
      }, 45000);
    }

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      switch (reason) {
        case DisconnectReason.loggedOut:
          await message.reply("🔴 *Sesión cerrada. Usa el comando nuevamente para reconectar.*");
          break;
        case DisconnectReason.restartRequired:
          handler(message, { conn, args, usedPrefix, command, isOwner });
          break;
        default:
          console.error("Razón desconocida:", reason);
      }
    }

    if (connection === 'open') {
      global.conns.push(socket);
      await conn.sendMessage(message.chat, {
        text: "✅ ¡Conexión establecida! Ahora eres un sub-bot.",
      }, { quoted: message });
    }
  });

  socket.ev.on('creds.update', saveState);
};

handler.command = /^ser(bot|subbot)$/i;
handler.owner = true;

export default handler;
