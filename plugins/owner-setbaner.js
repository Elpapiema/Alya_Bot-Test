import fs from 'fs';

const filePath = './personalize.json';

// Valores predeterminados
const defaultConfig = {
    botName: "Alya Mikhailovna Kujou",
    currency: "Yenes",
    videos: [
        "https://files.catbox.moe/b5n81s.mp4",
        "https://files.catbox.moe/o9vzpe.mp4",
        "https://files.catbox.moe/4qg0nz.mp4"
    ]
};

let handler = async (m, { conn, text, isOwner }) => {
    try {
        if (!isOwner) {
            return conn.reply(m.chat, '❌ Solo los administradores del bot pueden personalizarlo.', m);
        }

        if (!text) {
            return conn.reply(m.chat, '❌ Proporcione un enlace de video válido.', m);
        }

        if (!fs.existsSync(filePath)) {
            const initialData = { default: defaultConfig, owners: {}, users: {} };
            fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
        }

        const config = JSON.parse(fs.readFileSync(filePath));

        const ownerId = m.sender; // ID del administrador
        if (!config.owners[ownerId]) {
            config.owners[ownerId] = {
                videos: [...defaultConfig.videos],
                botName: defaultConfig.botName,
                currency: defaultConfig.currency
            };
        }

        config.owners[ownerId].videos.push(text); // Agregar nuevo video

        fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
        conn.reply(m.chat, `✅ Video añadido a la lista de banners.`, m);
    } catch (error) {
        conn.reply(m.chat, `❌ Error al establecer el banner: ${error.message}`, m);
    }
};

handler.help = ['setbanner'];
handler.tags = ['personalize'];
handler.command = /^setbanner$/i;

export default handler;