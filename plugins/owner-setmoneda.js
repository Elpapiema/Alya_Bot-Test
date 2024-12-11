import fs from 'fs';

const filePath = './personalize.json';
const defaultData = {
    botName: "Alya Mikhailovna Kujou",
    currency: "yen",
    videos: []
};

let handler = async (m, { conn, args, isOwner }) => {
    try {
        if (!isOwner) return conn.reply(m.chat, '❌ Solo los propietarios del bot pueden usar este comando.', m);

        if (args.length === 0) return conn.reply(m.chat, '❌ Por favor, proporciona una nueva moneda para el bot.', m);

        const newCurrency = args.join(' ');

        if (!fs.existsSync(filePath)) {
            const initialData = { default: defaultData, users: {} };
            fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
        }

        const config = JSON.parse(fs.readFileSync(filePath));
        if (!config.users[m.sender]) {
            config.users[m.sender] = { ...config.default };
        }

        config.users[m.sender].currency = newCurrency;

        fs.writeFileSync(filePath, JSON.stringify(config, null, 2));

        conn.reply(m.chat, `✅ Moneda personalizada cambiada a: *${newCurrency}*`, m);
    } catch (error) {
        conn.reply(m.chat, `❌ Error al cambiar la moneda: ${error.message}`, m);
    }
};

handler.help = ['setmoneda', 'setbotmoneda'];
handler.tags = ['owner'];
handler.command = /^(setmoneda|setbotmoneda)$/i;
handler.owner = true;

export default handler;
