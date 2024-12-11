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

let handler = async (m, { conn, args }) => {
    try {
        if (args.length === 0) {
            return conn.reply(m.chat, '❌ Por favor, proporciona el enlace del video a eliminar.', m);
        }

        const videoToRemove = args[0];

        // Verificar si el archivo de personalización existe, si no, crearlo
        if (!fs.existsSync(filePath)) {
            const initialData = { default: defaultData, users: {} };
            fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
        }

        // Leer la configuración
        const config = JSON.parse(fs.readFileSync(filePath));

        // Crear configuración específica para el usuario si no existe
        if (!config.users[m.sender]) {
            config.users[m.sender] = { ...config.default };
        }

        // Obtener la lista de videos personalizados del usuario
        const userVideos = config.users[m.sender].videos;

        // Verificar si el video a eliminar existe en la lista de videos del usuario
        const videoIndex = userVideos.indexOf(videoToRemove);

        if (videoIndex === -1) {
            return conn.reply(m.chat, '❌ El video especificado no está en tu lista de videos personalizados.', m);
        }

        // Eliminar el video de la lista
        userVideos.splice(videoIndex, 1);

        // Guardar los cambios en el archivo
        fs.writeFileSync(filePath, JSON.stringify(config, null, 2));

        conn.reply(m.chat, `✅ El video ha sido eliminado correctamente.`, m);
    } catch (error) {
        conn.reply(m.chat, `❌ Error al eliminar el video: ${error.message}`, m);
    }
};

handler.help = ['delbanner'];
handler.tags = ['owner'];
handler.command = /^(delbanner)$/i;
handler.owner = true;

export default handler;
