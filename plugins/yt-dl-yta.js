import fetch from 'node-fetch';

const handler = async (m, { conn, text, command }) => {
    if (!text) {
        return conn.reply(m.chat, '❌ Por favor proporciona un enlace válido de YouTube.', m);
    }

    try {
        // Obtener el recurso de audio desde la API secundaria
        const apiUrl = `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl);
        const result = await response.json();

        // Validar respuesta de la API secundaria
        if (!result.status || !result.data || !result.data.dl) {
            return conn.reply(m.chat, '❌ No se pudo obtener el recurso de audio. Verifica el enlace e intenta nuevamente.', m);
        }

        const { dl: audioUrl } = result.data;

        // Enviar solo el audio al usuario
        await conn.sendMessage(
            m.chat,
            {
                audio: { url: audioUrl },
                mimetype: 'audio/mp3',
                ptt: false, // Cambiar a true si se desea enviar como nota de voz
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