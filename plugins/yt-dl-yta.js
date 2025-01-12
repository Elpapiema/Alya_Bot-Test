import fetch from 'node-fetch';

const handler = async (m, { conn, text, command }) => {
    if (!text) {
        return conn.reply(m.chat, '❌ Por favor proporciona un enlace válido de YouTube.', m);
    }

    try {
        // Obtener información del video desde la API principal
        const infoApiUrl = `https://delirius-apiofc.vercel.app/download/ytmp3?url=${encodeURIComponent(text)}`;
        const infoResponse = await fetch(infoApiUrl);
        const infoResult = await infoResponse.json();

        // Validar respuesta de la API principal
        if (!infoResult.status || !infoResult.data) {
            return conn.reply(m.chat, '❌ No se pudo obtener información del video. Intenta nuevamente.', m);
        }

        const { title, author, duration, image } = infoResult.data;

        // Obtener el recurso de audio desde la segunda API
        const downloadApiUrl = `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(text)}`;
        const downloadResponse = await fetch(downloadApiUrl);
        const downloadResult = await downloadResponse.json();

        // Validar respuesta de la segunda API
        if (!downloadResult.status || !downloadResult.data || !downloadResult.data.dl) {
            return conn.reply(m.chat, '❌ No se pudo obtener el recurso de audio. Intenta nuevamente.', m);
        }

        const audioUrl = downloadResult.data.dl;

        // Formatear el mensaje
        const caption = `
🎶 *Descarga completada:*
*🔤 Título:* ${title}
*👤 Autor:* ${author}
*🕒 Duración:* ${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}
`;

        // Enviar el audio al usuario
        await conn.sendMessage(
            m.chat,
            {
                audio: { url: audioUrl },
                mimetype: 'audio/mp3',
                ptt: false, // Cambiar a true si se desea enviar como nota de voz
                caption,
            },
            { quoted: m }
        );
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Ocurrió un error al intentar procesar tu solicitud. Intenta nuevamente.', m);
    }
};

handler.command = /^(yta|ytmp3)$/i;

export default handler;