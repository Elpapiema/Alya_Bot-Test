import fs from 'fs';

const filePath = './personalize.json';

let handler = async (m, { conn }) => {
    try {
        if (!fs.existsSync(filePath)) {
            return conn.reply(m.chat, '❌ No se ha encontrado la configuración personalizada.', m);
        }

        const config = JSON.parse(fs.readFileSync(filePath));
        const isOwner = config.owners.hasOwnProperty(m.sender);

        let banner;
        // Buscar el banner del owner
        if (isOwner) {
            banner = config.owners[m.sender]?.banner;
            if (!banner) {
                return conn.reply(m.chat, '❌ No se ha configurado un banner para tu bot.', m);
            }
            return conn.reply(m.chat, `Banner para el bot *${config.owners[m.sender].botName}*:\n${banner}`, m);
        }

        // Buscar el banner del usuario
        if (config.users[m.sender]?.banner) {
            banner = config.users[m.sender].banner;
            return conn.reply(m.chat, `Tu banner personalizado:\n${banner}`, m);
        }

        return conn.reply(m.chat, '❌ No se ha configurado un banner.', m);
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Error al obtener el banner.', m);
    }
};

handler.help = ['viewbanner'];
handler.tags = ['personalizacion'];
handler.command = /^(viewbanner)$/i;

export default handler;