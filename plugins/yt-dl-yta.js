import ytdl from 'ytdl-core';
import axios from 'axios';

const handler = async (msg, { text, sendAudio, sendMessage }) => {
  if (!text) {
    await sendMessage(msg.chat, 'Por favor, proporciona un enlace de YouTube.', { quoted: msg });
    return;
  }

  const url = text.trim();
  if (!ytdl.validateURL(url)) {
    await sendMessage(msg.chat, 'El enlace proporcionado no es válido. Por favor, proporciona un enlace válido de YouTube.', { quoted: msg });
    return;
  }

  try {
    // Obtener metadatos usando la API
    const apiResponse = await axios.get(`https://delirius-apiofc.vercel.app/download/ytmp3?url=${url}`);
    const { data } = apiResponse;

    if (!data || !data.status) {
      await sendMessage(msg.chat, 'No se pudo obtener información del video. Inténtalo más tarde.', { quoted: msg });
      return;
    }

    const videoData = data.data;

    // Descarga del audio con ytdl-core
    const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });

    await sendAudio(msg.chat, stream, {
      mimetype: 'audio/mp3',
      ptt: false, // Cambiar a true si deseas enviarlo como nota de voz
      fileName: `${videoData.title}.mp3`,
      quoted: msg,
      caption: `🎵 *Título:* ${videoData.title}\n👤 *Autor:* ${videoData.author}\n📁 *Tamaño:* ${videoData.download.size}\n🕒 *Duración:* ${Math.floor(videoData.duration / 60)}:${videoData.duration % 60}`,
    });
  } catch (error) {
    console.error(error);
    await sendMessage(msg.chat, 'Ocurrió un error al intentar descargar el audio. Por favor, inténtalo nuevamente.', { quoted: msg });
  }
};

handler.help = ['ytaudio <link de YouTube>', 'yta <link de YouTube>'];
handler.tags = ['downloader'];
handler.command = /^(ytaudio|ytmp3|yta)$/i;

export default handler;