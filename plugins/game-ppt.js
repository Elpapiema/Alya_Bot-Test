import { randomUUID } from 'crypto';

const partidas = {};

const opciones = ['piedra', 'papel', 'tijeras'];

function obtenerResultado(e1, e2) {
  if (e1 === e2) return 'empate';
  if (
    (e1 === 'piedra' && e2 === 'tijeras') ||
    (e1 === 'tijeras' && e2 === 'papel') ||
    (e1 === 'papel' && e2 === 'piedra')
  ) return 'jugador1';
  return 'jugador2';
}

let handler = async (m, { conn, participants, isGroup, text, args }) => {
  if (!isGroup) return m.reply('❗Este comando solo puede usarse en grupos.');
  const mentionedJid = m.mentionedJid?.[0];
  if (!mentionedJid) return m.reply('👤 Menciona a alguien para jugar.\nEj: *.ppt @usuario*');

  const jugador1 = m.sender;
  const jugador2 = mentionedJid;
  const partidaId = randomUUID();

  partidas[partidaId] = {
    grupo: m.chat,
    jugador1,
    jugador2,
    eleccion1: null,
    eleccion2: null,
    timeout: null,
  };

  const enviarOpciones = async (jid, jugador) => {
    await conn.sendMessage(jid, {
      text: `🕹️ Has sido retado a un juego de *Piedra, Papel o Tijeras*.\n\nResponde este mensaje con una de las opciones:\n- piedra\n- papel\n- tijeras\n\nTienes 2 minutos para responder.`,
    });

    const espera = setTimeout(() => {
      delete partidas[partidaId];
      conn.sendMessage(m.chat, { text: '⌛ Tiempo agotado. El juego fue cancelado por inactividad.' });
    }, 2 * 60 * 1000); // 2 minutos

    partidas[partidaId].timeout = espera;
  };

  await enviarOpciones(jugador1, 'Jugador 1');
  await enviarOpciones(jugador2, 'Jugador 2');

  conn.ppt = conn.ppt || {};
  conn.ppt[partidaId] = partidas[partidaId];
};

handler.before = async function (m, { conn }) {
  if (!m.text) return;
  if (!conn.ppt) return;

  const entrada = Object.entries(conn.ppt).find(([_, partida]) =>
    (m.sender === partida.jugador1 || m.sender === partida.jugador2) &&
    (!partida.eleccion1 || !partida.eleccion2)
  );

  if (!entrada) return;

  const [partidaId, partida] = entrada;
  const eleccion = m.text.trim().toLowerCase();

  if (!opciones.includes(eleccion)) return;

  if (m.sender === partida.jugador1 && !partida.eleccion1) {
    partida.eleccion1 = eleccion;
    m.reply(`✅ Elección registrada: ${eleccion}`);
  }

  if (m.sender === partida.jugador2 && !partida.eleccion2) {
    partida.eleccion2 = eleccion;
    m.reply(`✅ Elección registrada: ${eleccion}`);
  }

  if (partida.eleccion1 && partida.eleccion2) {
    clearTimeout(partida.timeout);
    const resultado = obtenerResultado(partida.eleccion1, partida.eleccion2);
    let mensaje = `🎮 *Resultado del juego de Piedra, Papel o Tijeras:*\n\n`;
    mensaje += `👤 ${partida.jugador1.split('@')[0]} eligió: *${partida.eleccion1}*\n`;
    mensaje += `👤 ${partida.jugador2.split('@')[0]} eligió: *${partida.eleccion2}*\n\n`;

    if (resultado === 'empate') {
      mensaje += '🤝 ¡Es un empate!';
    } else {
      const ganador = resultado === 'jugador1' ? partida.jugador1 : partida.jugador2;
      mensaje += `🏆 El ganador es: @${ganador.split('@')[0]}`;
    }

    await conn.sendMessage(partida.grupo, { text: mensaje, mentions: [partida.jugador1, partida.jugador2] });
    delete conn.ppt[partidaId];
  }
};

handler.help = ['ppt @usuario'];
handler.tags = ['games'];
handler.command = /^ppt$/i;
handler.group = true;

export default handler;