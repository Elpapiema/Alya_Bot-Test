import fs from 'fs';

const filePath = './personalize.json';

let handler = async (m, { conn }) => {
    try {
        if (!fs.existsSync(filePath)) {
            return conn.reply(m.chat, 'No se ha encontrado el archivo de personalización.', m);
        }

        const config = JSON.parse(fs.readFileSync(filePath));
        const isOwner = config.owners.hasOwnProperty(m.sender);

        // Determinar qué entrada mostrar: Owner o Usuario
        const videos =
            (isOwner && config.owners[m.sender]?.videos) ||
            config.users[m.sender]?.videos ||
            config.default.videos;

        if (!videos || videos.length === 0) {
            return conn.reply(
                m.chat,
                'No se encontraron videos personalizados para este bot o usuario.',
                m
            );
        }

        const videoList = videos.map((url, index) => `${index + 1}. ${url}`).join('\n');
        const message = `🎥 *Videos Personalizados:*\n\n${videoList}`;

        conn.reply(m.chat, message, m);
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Error al cargar los videos personalizados.', m);
    }
};

handler.help = ['viewbanner'];
handler.tags = ['personalizacion'];
handler.command = /^(viewbanner)$/i;

export default handler;