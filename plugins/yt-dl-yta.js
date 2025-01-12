import fetch from 'node-fetch';

const handler = async (m, { conn, text, command }) => {
    if (!text) {
        return conn.reply(m.chat, '❌ Por favor proporciona un enlace válido de YouTube.', m);
    }

    try {
        // Usar la API proporcionada
        const apiUrl = `https://delirius-apiofc.vercel.app/download/ytmp3?url=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl);
        const result = await response.json();

        // Validar respuesta
        if (!result.status || !result.data || !result.data.download || !result.data.download.url) {
            return conn.reply(m.chat, '❌ No se pudo descargar el audio. Verifica el enlace e intenta nuevamente.', m);
        }

        // Obtener datos del video
        const { title, author, duration, image, download } = result.data;
        const { url: audioUrl, size, quality } = download;

        const caption = `
🎶 *Descarga completada:*
*🔤 Título:* ${title}
*👤 Autor:* ${author}
*🕒 Duración:* ${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}
*📁 Tamaño:* ${size}
*🎧 Calidad:* ${quality}
`;

        // Enviar el audio al usuario
        await conn.sendMessage(
            m.chat,
            {
                audio: { url: audioUrl },
                mimetype: 'audio/mp3',
                ptt: false, // Cambiar a true si se desea enviar como nota de voz
                caption, // Incluir detalles del video
            },
            { quoted: m }
        );
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Ocurrió un error al intentar descargar el audio.', m);
    }
};

handler.command = /^(yta|ytmp3)$/i;

export default handler;