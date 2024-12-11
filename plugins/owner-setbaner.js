import fs from 'fs';
const filePath = './personalize.json';

// Enlaces predeterminados
const defaultVideos = [
    'https://qu.ax/WgJR.mp4', // Primer video predeterminado
    'https://qu.ax/kOwY.mp4', // Segundo video predeterminado
    'https://qu.ax/UYGf.mp4'  // Tercer video predeterminado
];

let handler = async (m, { conn, args, command, isOwner }) => {
    try {
        // Verificar si el usuario tiene permisos (solo los dueños del bot pueden usar este comando)
        if (!isOwner) return conn.reply(m.chat, '❌ Solo los propietarios del bot pueden usar este comando.', m);

        // Verificar si el archivo existe, si no, crearlo con los valores predeterminados
        if (!fs.existsSync(filePath)) {
            const initialData = { videos: defaultVideos };
            fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
        }

        // Cargar el archivo JSON
        let videoConfig = JSON.parse(fs.readFileSync(filePath));

        // Comprobar si se proporcionó una URL
        if (args.length === 0) {
            return conn.reply(m.chat, '❌ Por favor, proporciona una URL válida del video GIF.', m);
        }

        const videoUrl = args[0];
        if (!videoUrl.startsWith('http')) {
            return conn.reply(m.chat, '❌ La URL proporcionada no es válida. Debe comenzar con "http".', m);
        }

        // Agregar la URL al archivo de configuración
        videoConfig.videos.push(videoUrl);

        // Guardar el archivo actualizado
        fs.writeFileSync(filePath, JSON.stringify(videoConfig, null, 2));

        // Responder al usuario
        conn.reply(
            m.chat,
            `✅ Video GIF agregado correctamente.\n\nVideos actuales:\n${videoConfig.videos.join('\n')}`,
            m
        );
    } catch (error) {
        conn.reply(m.chat, `❌ Error al ejecutar el comando: ${error.message}`, m);
    }
};

// Configuración del comando
handler.help = ['setbanner', 'setbotimg'];
handler.tags = ['owner'];
handler.command = /^(setbanner|setbotimg)$/i; // Comandos aceptados
handler.owner = true; // Solo propietarios del bot

export default handler;
