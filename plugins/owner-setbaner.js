import fs from 'fs';

const filePath = './personalize.json';
const defaultData = {
    botName: "Alya Mikhailovna Kujou",
    currency: "yen",
    videos: [
        'https://qu.ax/WgJR.mp4',
        'https://qu.ax/kOwY.mp4',
        'https://qu.ax/UYGf.mp4'
    ]
};

let handler = async (m, { conn, args, isOwner }) => {
    try {
        if (!isOwner) return conn.reply(m.chat, '❌ Solo los propietarios del bot pueden usar este comando.', m);

        if (args.length === 0) {
            return conn.reply(m.chat, '❌ Por favor, proporciona al menos un enlace de video.', m);
        }

        const newVideos = args;

        // Verificar si el archivo existe, y si no, crearlo con datos predeterminados
        if (!fs.existsSync(filePath)) {
            const initialData = { default: defaultData, users: {} };
            fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
        }

        // Leer la configuración actual
        const config = JSON.parse(fs.readFileSync(filePath));

        // Crear configuración específica para el usuario si no existe
        if (!config.users[m.sender]) {
            config.users[m.sender] = { ...config.default };
        }

        // Actualizar los videos personalizados para el usuario
        config.users[m.sender].videos = newVideos;

        // Guardar los cambios en el archivo
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
