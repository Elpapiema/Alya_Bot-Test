import fetch from 'node-fetch';
import ytdl from 'ytdl-core';

const handler = async (m, { conn, text, command }) => {
    if (!text) {
        return conn.reply(m.chat, '❌ Por favor proporciona un enlace válido de YouTube.', m);
    }

    try {
        // Validar si el enlace es válido
        if (!ytdl.validateURL(text)) {
            return conn.reply(m.chat, '❌ El enlace proporcionado no es válido. Proporcione un enlace válido de YouTube.', m);
        }

        // Llamar a la API para obtener información del video
        const apiUrl = `https://delirius-apiofc.vercel.app/download/ytmp3?url=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl);
        const result = await response.json();

        // Validar respuesta de la API
        if (!result.status || !result.data) {
            return conn.reply(m.chat, '❌ No se pudo obtener información del video. Intenta nuevamente.', m);
        }

        // Obtener datos del video
        const { title, author, duration, image } = result.data;

        const caption = `
🎶 *Descarga completada:*
*🔤 Título:* ${title}
*👤 Autor:* ${author}
*🕒 Duración:* ${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}
`;

        // Usar ytdl-core para obtener el audio
        const audioStream = ytdl(text, {
            filter: 'audioonly',
            quality: 'highestaudio',
        });

        // Enviar el audio al usuario
        await conn.sendMessage(
            m.chat,
            {
                audio: audioStream,
                mimetype: 'audio/mp3',
                ptt: false, // Cambiar a true si se desea enviar como nota de voz
                caption, // Incluir detalles del video
            },
            { quoted: m }
        );
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Ocurrió un error al intentar descargar el audio. Por favor, inténtalo nuevamente.', m);
    }
};

handler.command = /^(yta|ytmp3)$/i;

export default handler;