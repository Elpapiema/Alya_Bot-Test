import fs from 'fs';

const filePath = './personalize.json';

let handler = async (m, { args, isOwner }) => {
    try {
        if (!fs.existsSync(filePath)) {
            const initialData = { default: {}, owners: {}, users: {} };
            fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
        }

        const config = JSON.parse(fs.readFileSync(filePath));
        const userType = isOwner ? `owners.${m.sender}` : `users.${m.sender}`;
        const newName = args.join(' ').trim();

        if (!newName) throw 'Debe proporcionar un nombre para el bot.';

        // Crear estructura si no existe
        if (!config[userType]) config[userType] = {};
        config[userType].botName = newName;

        fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
        m.reply(`✅ Nombre del bot actualizado a "${newName}" para ${isOwner ? 'owner' : 'usuario'}.`);
    } catch (error) {
        m.reply(`❌ Error: ${error.message}`);
    }
};

handler.help = ['setname <nombre>', 'setbotname <nombre>'];
handler.tags = ['owner', 'personalization'];
handler.command = /^(setname|setbotname)$/i;

export default handler;