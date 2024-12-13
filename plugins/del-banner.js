import fs from 'fs';

const filePath = './personalize.json';

let handler = async (m, { conn }) => {
    try {
        if (!fs.existsSync(filePath)) {
            return conn.reply(m.chat, '❌ No se ha encontrado la configuración personalizada.', m);
        }

        const config = JSON.parse(fs.readFileSync(filePath));
        const isOwner = config.owners.hasOwnProperty(m.sender);

        if (isOwner) {
            if (!config.owners[m.sender]?.banner) {
                return conn.reply(m.chat, '❌ No se ha configurado un banner para este bot.', m);
            }
            delete config.owners[m.sender].banner;
            fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
            return conn.reply(m.chat, '¡Banner eliminado exitosamente para el bot!', m);
        }

        if (config.users[m.sender]?.banner) {
            delete config.users[m.sender].banner;
            fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
            return conn.reply(m.chat, '¡Banner eliminado exitosamente de tu cuenta!', m);
        }

        return conn.reply(m.chat, '❌ No se ha configurado un banner para tu cuenta.', m);
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Error al eliminar el banner.', m);
    }
};

handler.help = ['deletebanner'];
handler.tags = ['personalizacion'];
handler.command = /^(deletebanner)$/i;

export default handler;