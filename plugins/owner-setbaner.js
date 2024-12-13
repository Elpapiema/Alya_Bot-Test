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

        // Si es owner, guardar el banner en "owners"
        if (isOwner) {
            if (!text) {
                return conn.reply(m.chat, 'Por favor, proporciona una URL para el banner.', m);
            }

            // Modificar el banner del owner
            if (!config.owners[m.sender]) {
                config.owners[m.sender] = {};
            }

            config.owners[m.sender].banner = text;

            fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
            return conn.reply(m.chat, `¡Banner actualizado para el bot *${config.owners[m.sender].botName}* con éxito!`, m);
        } 

        // Si no es owner, guardamos el banner bajo "users"
        if (!config.users[m.sender]) {
            config.users[m.sender] = {};
        }

        config.users[m.sender].banner = text;

        fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
        return conn.reply(m.chat, `¡Banner actualizado para tu cuenta con éxito!`, m);
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Error al actualizar el banner.', m);
    }
};

handler.help = ['setbanner <url>'];
handler.tags = ['personalizacion'];
handler.command = /^(setbanner)$/i;

export default handler;