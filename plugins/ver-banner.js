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

let handler = async (m, { conn }) => {
    try {
        // Verificar si el archivo de personalización existe, si no, crearlo
        if (!fs.existsSync(filePath)) {
            const initialData = { default: defaultData, users: {} };
            fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
        }

        // Leer la configuración
        const config = JSON.parse(fs.readFileSync(filePath));
        
        // Obtener los videos personalizados del usuario o los predeterminados
        const userConfig = config.users[m.sender] || config.default;
        const videos = userConfig.videos;

        // Verificar si el usuario tiene videos personalizados
        if (videos.length === 0) {
            return conn.reply(m.chat, '❌ No tienes videos personalizados configurados. Usa *setbanner* para añadirlos.', m);
        }

        // Crear el mensaje que incluirá los videos
        let videoList = `🔹 *Tus Videos Personalizados:*\n\n`;
        videos.forEach((video, index) => {
            videoList += `\n${index + 1}. ${video}`;
        });

        conn.reply(m.chat, videoList, m);

    } catch (error) {
        conn.reply(m.chat, `❌ Error al mostrar los videos: ${error.message}`, m);
    }
};

handler.help = ['verbanner', 'viewbanner'];
handler.tags = ['info'];
handler.command = /^(verbanner|viewbanner)$/i;

export default handler;
