import fetch from 'node-fetch';

const handler = async (m, { conn, text, command }) => {
    if (!text) {
        return conn.reply(m.chat, '❌ Por favor proporciona un enlace válido de YouTube.', m);
    }

    try {
        // Primera API: Obtener metadatos del video
        const metadataApiUrl = `https://delirius-apiofc.vercel.app/download/ytmp4?url=${encodeURIComponent(text)}`;
        const metadataResponse = await fetch(metadataApiUrl);
        const metadataResult = await metadataResponse.json();

        if (!metadataResult || !metadataResult.estado || !metadataResult.datos) {
            return conn.reply(m.chat, '❌ No se pudo obtener la información del video. Verifica el enlace e intenta nuevamente.', m);
        }

        const { título: title, duración: duration, imagen: thumb } = metadataResult.datos;

        // Segunda API: Obtener enlace de descarga
        const downloadApiUrl = `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(text)}`;
        const downloadResponse = await fetch(downloadApiUrl);
        const downloadResult = await downloadResponse.json();

        if (!downloadResult || !downloadResult.status || !downloadResult.data || !downloadResult.data.dl) {
            return conn.reply(m.chat, '❌ No se pudo descargar el video. Intenta nuevamente más tarde.', m);
        }

        const { dl: videoUrl } = downloadResult.data;

        const caption = `
🎥 *Descarga completada:*
*🔤 Título:* ${title}
*🕒 Duración:* ${duration} segundos
`;

        // Enviar el video al usuario
        await conn.sendMessage(
            m.chat,
            {
                video: { url: videoUrl },
                caption,
                jpegThumbnail: await (await fetch(thumb)).buffer(), // Thumbnail del video
            },
            { quoted: m }
        );
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Ocurrió un error al intentar procesar el video.', m);
    }
};

handler.command = /^(yt|ytv|ytmp4)$/i;

export default handler;