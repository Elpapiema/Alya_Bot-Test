import fetch from 'node-fetch';

let handler = async (m, { args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `✧ Ejemplo: ${usedPrefix}${command} https://www.tiktok.com/@usuario/video/1234567890`;
  }

  const servers = [
    { name: 'Server Masha', url: alya1 },
    { name: 'Server Alya', url: alya2 },
    { name: 'Server Masachika', url: alya3 }
  ];

  // Reordenar aleatoriamente los servidores
  const shuffledServers = servers.sort(() => Math.random() - 0.5);
  let success = false;
  let lastError = '';

  for (let server of shuffledServers) {
    const endpoint = `${server.url}/Tiktok_videodl?url=${encodeURIComponent(args[0])}`;
    try {
      //await conn.sendMessage(m.chat, { text: `📡 Usando *${server.name}*...\n⏳ Procesando tu video...` }, { quoted: m });

      const res = await fetch(endpoint);
      if (!res.ok) throw `⚠️ Respuesta inválida del servidor (${res.status})`;

      const json = await res.json();
      if (!json.video_url) throw `⚠️ El servidor no devolvió un video válido`;

      await conn.sendFile(m.chat, json.video_url, 'tiktok.mp4', `✅ *Descarga exitosa*\n🎬 Aquí tienes tu video de TikTok\n\n💫 Procesado por: *${server.name}*`, m);
      success = true;
      break; // Éxito, salimos del ciclo
    } catch (err) {
      lastError = `❌ Falló ${server.name}: ${err}`;
      console.log(lastError);
    }
  }

  if (!success) {
    throw `🚫 No se pudo descargar el video desde ninguno de los servidores disponibles.\n\n${lastError}`;
  }
};

handler.help = ['tt <url>', 'tiktok <url>'];
handler.tags = ['downloader'];
handler.command = /^tt|tiktok$/i;

export default handler;

/*import fetch from 'node-fetch';

const handler = async (m, { conn, text, command }) => {
    if (!text) {
        return conn.reply(m.chat, '❌ Por favor proporciona un enlace válido de TikTok.', m);
    }

    try {
        const apiUrl = `https://api.dorratz.com/v2/tiktok-dl?url=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (!result || !result.status || !result.data || !result.data.media || !result.data.media.org) {
            return conn.reply(m.chat, '❌ No se pudo descargar el video. Verifica el enlace e intenta nuevamente.', m);
        }

        const videoUrl = result.data.media.org;

        // Obtener información adicional
        const author = result.data.author?.nickname || 'Desconocido';
        const username = result.data.author?.username || 'Desconocido';
        const title = result.data.title || 'Sin título';
        const likes = result.data.like || '0';
        const shares = result.data.share || '0';
        const comments = result.data.comment || '0';
        const repro = result.data.repro || '0';

        const caption = `
✅ *Video descargado correctamente:*

👤 Autor: ${author} (${username})
👍 Me gusta: ${likes}
🔄 Compartidos: ${shares}
💬 Comentarios: ${comments}
`;

        // Enviar el video al usuario
        await conn.sendMessage(m.chat, {
            video: { url: videoUrl },
            caption,
        }, { quoted: m });
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Ocurrió un error al intentar descargar el video.', m);
    }
};

handler.command = /^(tt|tiktok)$/i;

export default handler;*/