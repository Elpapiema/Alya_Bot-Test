import fs from 'fs';

const filePath = './personalize.json';

let handler = async (m, { conn, text }) => {
    try {
        if (!fs.existsSync(filePath)) {
            const initialData = { default: {}, owners: {}, users: {} };
            fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
        }

        const config = JSON.parse(fs.readFileSync(filePath));
        const isOwner = config.owners.hasOwnProperty(m.sender);

        // Validar que se proporcione al menos una URL
        if (!text) {
            return conn.reply(m.chat, 'Por favor, proporciona una o más URLs separadas por comas.', m);
        }

        // Convertir las URLs en un arreglo
        const videoUrls = text.split(',').map(url => url.trim());

        // Si es owner, guardar las URLs en "owners"
        if (isOwner) {
            if (!config.owners[m.sender]) {
                config.owners[m.sender] = {};
            }

            config.owners[m.sender].videos = videoUrls;

            fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
            return conn.reply(
                m.chat,
                `¡Videos actualizados para el bot *${config.owners[m.sender].botName || 'sin nombre'}*!`,
                m
            );
        }

        // Si no es owner, guardar las URLs bajo "users"
        if (!config.users[m.sender]) {
            config.users[m.sender] = {};
        }

        config.users[m.sender].videos = videoUrls;

        fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
        return conn.reply(
            m.chat,
            '¡Videos personalizados actualizados exitosamente!',
            m
        );
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Error al actualizar los videos.', m);
    }
};

handler.help = ['setbanner <url1,url2,...>'];
handler.tags = ['personalizacion'];
handler.command = /^(setbanner)$/i;

export default handler;