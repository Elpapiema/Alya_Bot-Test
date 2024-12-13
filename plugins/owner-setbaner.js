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
        const videoUrl = args[0];

        if (!videoUrl) throw 'Debe proporcionar un link de video para establecer.';

        // Crear estructura si no existe
        if (!config[userType]) config[userType] = {};
        if (!config[userType].videos) config[userType].videos = [];
        
        // Agregar el video
        config[userType].videos.push(videoUrl);

        fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
        m.reply(`✅ Video añadido correctamente a la personalización de ${isOwner ? 'owner' : 'usuario'}.`);
    } catch (error) {
        m.reply(`❌ Error: ${error.message}`);
    }
};

handler.help = ['setbanner <link>'];
handler.tags = ['owner', 'personalization'];
handler.command = /^(setbanner|setbotimg)$/i;

export default handler;