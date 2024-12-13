import fs from 'fs';

const filePath = './personalize.json';

let handler = async (m, { isOwner }) => {
    try {
        if (!fs.existsSync(filePath)) throw 'No se encontró el archivo de personalización.';

        const config = JSON.parse(fs.readFileSync(filePath));
        const userType = isOwner ? `owners.${m.sender}` : `users.${m.sender}`;

        if (config[userType]) {
            delete config[userType];
            fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
            m.reply(`✅ Personalización eliminada para ${isOwner ? 'owner' : 'usuario'}.`);
        } else {
            m.reply('No hay personalización para eliminar.');
        }
    } catch (error) {
        m.reply(`❌ Error: ${error.message}`);
    }
};

handler.help = ['resetpreferences', 'reiniciarpreferencias'];
handler.tags = ['owner', 'personalization'];
handler.command = /^(resetpreferences|reiniciarpreferencias)$/i;

export default handler;