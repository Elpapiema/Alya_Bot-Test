import fetch from 'node-fetch';

const handler = async (m, { conn, text, command }) => {
    const apiUrl = `https://exonity.tech/api/ytdlp2-faster?apikey=adminsepuh&url=${encodeURIComponent(text)}`;

    if (!text) {
        return conn.reply(m.chat, '❌ Por favor, proporciona un enlace válido de YouTube.', m);
    }

    try {
        // Conectar con la API
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Error al conectar con la API.');
        const json = await response.json();

        if (json.status !== 200 || !json.result) {
            throw new Error('No se pudo obtener información del video.');
        }

        const { title, thumb, duration, description, audio } = json.result;

        // Enviar mensaje con los detalles del video
        const message = `
⏳ Procesando tu solicitud...

📹 *Título*: ${title}
⏳ *Duración*: ${duration}
📝 *Descripción*: ${description || 'Sin descripción disponible.'}
        `;
        await conn.sendMessage(m.chat, {
            image: { url: thumb },
            caption: message,
        });

        // Enviar el audio por separado
        await conn.sendMessage(m.chat, {
            audio: { url: audio },
            mimetype: 'audio/mpeg',
        });
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Ocurrió un error al procesar tu solicitud.', m);
    }
};

handler.help = ['yta', 'ytmp3'];
handler.tags = ['downloader'];
handler.command = /^(yta|ytmp3)$/i;

export default handler;