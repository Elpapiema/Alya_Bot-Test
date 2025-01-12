import fetch from 'node-fetch';
import ytdl from 'ytdl-core';

const handler = async (m, { conn, text, command }) => {
    if (!text) {
        return conn.reply(m.chat, '❌ Por favor proporciona un enlace válido de YouTube.', m);
    }

    try {
        // Llamar a la API para obtener información del video
        const apiUrl = `https://delirius-apiofc.vercel.app/download/ytmp3?url=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl);
        const result = await response.json();

        // Validar respuesta de la API
        if (!result.status || !result.data || !result.data.download || !result.data.download.url) {
            return conn.reply(m.chat, '❌ No se pudo obtener información del video. Intenta nuevamente.', m);
        }

        // Obtener datos del video
        const { title, author, duration, image, download } = result.data;
        const { size, quality } = download;

        const caption = `
🎶 *Descarga completada:*
*🔤 Título:* ${title}
*👤 Autor:* ${author}
*🕒 Duración:* ${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}
*📁 Tamaño:* ${size}
*🎧 Calidad:* ${quality}
`;

        // Intentar obtener el audio directamente desde la URL de la API
        try {
            await conn.sendMessage(
                m.chat,
                {
                    audio: { url: download.url },
                    mimetype: 'audio/mp3',
                    ptt: false, // Cambiar a true si se desea enviar como nota de voz
                    caption,
                },
                { quoted: m }
            );
        } catch (apiError) {
            console.warn('Error al usar la URL de la API, usando ytdl-core:', apiError.message);

            // Si la URL de la API falla, usar ytdl-core como respaldo
            const audioStream = ytdl(text, {
                filter: 'audioonly',
                quality: 'highestaudio',
            });

            await conn.sendMessage(
                m.chat,
                {
                    audio: audioStream,
                    mimetype: 'audio/mp3',
                    ptt: false,
                    caption,
                },
                { quoted: m }
            );
        }
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Ocurrió un error al intentar descargar el audio. Por favor, inténtalo nuevamente.', m);
    }
};

handler.command = /^(yta|ytmp3)$/i;

export default handler;