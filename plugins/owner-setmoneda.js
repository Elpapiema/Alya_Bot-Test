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
        const newCurrency = args.join(' ').trim();

        if (!newCurrency) throw 'Debe proporcionar un nombre para la moneda.';

        // Crear estructura si no existe
        if (!config[userType]) config[userType] = {};
        config[userType].currency = newCurrency;

        fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
        m.reply(`✅ Moneda del bot actualizada a "${newCurrency}" para ${isOwner ? 'owner' : 'usuario'}.`);
    } catch (error) {
        m.reply(`❌ Error: ${error.message}`);
    }
};

handler.help = ['setmoneda <moneda>', 'setbotmoneda <moneda>'];
handler.tags = ['owner', 'personalization'];
handler.command = /^(setmoneda|setbotmoneda)$/i;

export default handler;