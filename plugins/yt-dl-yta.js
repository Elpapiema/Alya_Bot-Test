import ytdl from 'ytdl-core';
import axios from 'axios';

const handler = async (msg, { text, sendMessage, sendAudio }) => {
  if (!text) {
    if (typeof sendMessage === 'function') {
      await sendMessage(msg.chat, 'Por favor, proporciona un enlace de YouTube.', { quoted: msg });
    }
    return;
  }

  const url = text.trim();
  if (!ytdl.validateURL(url)) {
    if (typeof sendMessage === 'function') {
      await sendMessage(msg.chat, 'El enlace proporcionado no es válido. Por favor, proporciona un enlace válido de YouTube.', { quoted: msg });
    }
    return;
  }

  try {
    const apiResponse = await axios.get(`https://delirius-apiofc.vercel.app/download/ytmp3?url=${url}`);
    const { data } = apiResponse;

    if (!data || !data.status) {
      if (typeof sendMessage === 'function') {
        await sendMessage(msg.chat, 'No se pudo obtener información del video. Inténtalo más tarde.', { quoted: msg });
      }
      return;
    }

    const videoData = data.data;
    const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });

    if (typeof sendAudio === 'function') {
      await sendAudio(msg.chat, stream, {
        mimetype: 'audio/mp3',
        ptt: false,
        fileName: `${videoData.title}.mp3`,
        quoted: msg,
        caption: `🎵 *Título:* ${videoData.title}\n👤 *Autor:* ${videoData.author}\n📁 *Tamaño:* ${videoData.download.size}\n🕒 *Duración:* ${Math.floor(videoData.duration / 60)}:${videoData.duration % 60}`,
      });
    }
  } catch (error) {
    console.error(error);
    if (typeof sendMessage === 'function') {
      await sendMessage(msg.chat, 'Ocurrió un error al intentar descargar el audio. Por favor, inténtalo nuevamente.', { quoted: msg });
    }
  }
};

handler.help = ['ytaudio <link de YouTube>', 'yta <link de YouTube>'];
handler.tags = ['downloader'];
handler.command = /^(ytaudio|ytmp3|yta)$/i;

export default handler;