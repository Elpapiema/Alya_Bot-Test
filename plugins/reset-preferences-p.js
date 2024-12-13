import fs from 'fs';

const filePath = './personalize.json';

let handler = async (m, { conn }) => {
    try {
        if (!fs.existsSync(filePath)) {
            return conn.reply(m.chat, '❌ No se ha encontrado la configuración personalizada.', m);
        }

        const config = JSON.parse(fs.readFileSync(filePath));

        if (config.owners[m.sender]) {
            delete config.owners[m.sender];
            fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
            return conn.reply(m.chat, '¡Preferencias del bot restablecidas exitosamente!', m);
        }

        if (config.users[m.sender]) {
            delete config.users[m.sender];
            fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
            return conn.reply(m.chat, '¡Tus preferencias han sido restablecidas exitosamente!', m);
        }

        return conn.reply(m.chat, '❌ No se encontraron preferencias personalizadas para restablecer.', m);
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Error al restablecer las preferencias.', m);
    }
};

handler.help = ['resetpreferences'];
handler.tags = ['personalizacion'];
handler.command = /^(resetpreferences)$/i;

export default handler;