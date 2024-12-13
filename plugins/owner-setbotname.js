import fs from 'fs';

const filePath = './personalize.json';

let handler = async (m, { conn, text }) => {
    try {
        if (!fs.existsSync(filePath)) {
            const initialData = { default: {}, owners: {}, users: {} };
            fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
        }

        const config = JSON.parse(fs.readFileSync(filePath));

        // Verificar si el sender es un owner
        const isOwner = config.owners.hasOwnProperty(m.sender);
        
        // Si es owner, la personalización se guarda bajo "owners"
        if (isOwner) {
            if (!text) {
                return conn.reply(m.chat, 'Por favor, proporciona un nombre para el bot.', m);
            }

            // Modificar el botName del owner
            if (!config.owners[m.sender]) {
                config.owners[m.sender] = {};
            }

            config.owners[m.sender].botName = text;

            // Guardar la configuración actualizada
            fs.writeFileSync(filePath, JSON.stringify(config, null, 2));

            return conn.reply(m.chat, `¡Nombre del bot actualizado a *${text}* para este bot!`, m);
        } 

        // Si el usuario no es owner, personalizar bajo "users"
        if (!config.users[m.sender]) {
            config.users[m.sender] = {};
        }

        config.users[m.sender].botName = text;

        // Guardar la configuración actualizada
        fs.writeFileSync(filePath, JSON.stringify(config, null, 2));

        return conn.reply(m.chat, `¡Nombre del bot actualizado a *${text}* para tu cuenta!`, m);
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Error al actualizar el nombre del bot.', m);
    }
};

handler.help = ['setname <nombre>'];
handler.tags = ['personalizacion'];
handler.command = /^(setname)$/i;

export default handler;