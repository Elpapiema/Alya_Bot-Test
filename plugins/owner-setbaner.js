import fs from 'fs';

const filePath = './personalize.json';

let handler = async (m, { conn, args, isOwner }) => {
    try {
        if (!isOwner) return conn.reply(m.chat, '❌ Solo los propietarios del bot pueden usar este comando.', m);

        if (args.length === 0) return conn.reply(m.chat, '❌ Por favor, proporciona al menos un enlace de video.', m);

        const newVideos = args;

        if (!fs.existsSync(filePath)) {
            const initialData = { default: defaultData, users: {} };
            fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
        }

        const config = JSON.parse(fs.readFileSync(filePath));
        if (!config.users[m.sender]) {
            config.users[m.sender] = { ...config.default };
        }

        config.users[m.sender].videos = newVideos;

        fs.writeFileSync(filePath, JSON.stringify(config, null, 2));

        conn.reply(m.chat, `✅ Videos personalizados actualizados correctamente.`, m);
    } catch (error) {
        conn.reply(m.chat, `❌ Error al actualizar los videos: ${error.message}`, m);
    }
};

handler.help = ['setbanner', 'setbotimg'];
handler.tags = ['owner'];
handler.command = /^(setbanner|setbotimg)$/i;
handler.owner = true;

export default handler;
