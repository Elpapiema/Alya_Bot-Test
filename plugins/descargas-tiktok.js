import fetch from 'node-fetch';

const handler = async (m, { conn, text, command }) => {
    if (!text) {
        return conn.reply(m.chat, '❌ Por favor proporciona un enlace válido de TikTok.', m);
    }

    try {
        const apiUrl = `https://deliriussapi-oficial.vercel.app/download/tiktok?url=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (!result || !result.success || !result.video) {
            return conn.reply(m.chat, '❌ No se pudo descargar el video. Verifica el enlace e intenta nuevamente.', m);
        }

        const videoUrl = result.video;

        // Enviar el video al usuario
        await conn.sendMessage(m.chat, {
            video: { url: videoUrl },
            caption: '✅ Aquí tienes tu video de TikTok.',
        }, { quoted: m });
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Ocurrió un error al intentar descargar el video.', m);
    }
};

handler.command = /^(tt|tiktok)$/i;

export default handler;
