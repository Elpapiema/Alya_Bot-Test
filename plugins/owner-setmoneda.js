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

        // Si es owner, actualizar la moneda en "owners"
        if (isOwner) {
            if (!text) {
                return conn.reply(m.chat, 'Por favor, proporciona una moneda para el bot.', m);
            }

            if (!config.owners[m.sender]) {
                config.owners[m.sender] = {};
            }

            config.owners[m.sender].currency = text;

            fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
            return conn.reply(m.chat, `¡Moneda actualizada para el bot *${config.owners[m.sender].botName}* a *${text}*`, m);
        }

        // Si no es owner, actualizar la moneda bajo "users"
        if (!config.users[m.sender]) {
            config.users[m.sender] = {};
        }

        config.users[m.sender].currency = text;

        fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
        return conn.reply(m.chat, `✅ ¡Moneda actualizada para tu cuenta a *${text}*`, m);
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Error al actualizar la moneda.', m);
    }
};

handler.help = ['setmoneda <moneda>'];
handler.tags = ['personalizacion'];
handler.command = /^(setmoneda)$/i;

export default handler;