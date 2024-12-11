import fs from 'fs';

const filePath = './personalize.json';
const defaultVideos = [
    'https://qu.ax/WgJR.mp4', // Primer video predeterminado
    'https://qu.ax/kOwY.mp4', // Segundo video predeterminado
    'https://qu.ax/UYGf.mp4'  // Tercer video predeterminado
];

let handler = async (m, { conn }) => {
    try {
        // Verificar si el archivo existe, si no, crearlo con los valores predeterminados
        if (!fs.existsSync(filePath)) {
            const initialData = { videos: defaultVideos };
            fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
        }

        // Cargar el archivo JSON
        const videoConfig = JSON.parse(fs.readFileSync(filePath));

        // Obtener un video aleatorio de la lista
        const randomVideoUrl = videoConfig.videos[Math.floor(Math.random() * videoConfig.videos.length)];

        // Texto del mensaje del menú
        const menuMessage = `
┎┈┈┈┈┈┈┈┈┈┈┈୨ Ｉｎｆｏ ୧┈┈┈┈┈┈┈┈┈┈┒
┊
┊
┊   ✦ Desarrollado por: 𝓔𝓶𝓶𝓪 (𝓥𝓲𝓸𝓵𝓮𝓽'𝓼 𝓥𝓮𝓻𝓼𝓲𝓸𝓷)
┊   
┊   ✦ Versión actual: 1.2.3
┊
┊
┖┈┈┈┈┈┈┈┈┈┈┈┈┈┈୨♡୧┈┈┈┈┈┈┈┈┈┈┈┈┈┚`;

        // Enviar el video aleatorio interpretado como GIF con reproducción automática
        await conn.sendMessage(
            m.chat,
            {
                video: { url: randomVideoUrl },
                gifPlayback: true,  // Reproducción automática de GIF
                caption: menuMessage,  // El mensaje del menú
                mentions: [m.sender]  // Mencionar al remitente del mensaje
            }
        );
    } catch (error) {
        conn.reply(m.chat, `❌ Error al cargar el menú: ${error.message}`, m);
    }
};

// Configuración del comando
handler.help = ['menu'];
handler.tags = ['info'];
handler.command = /^(menu)$/i; // Comando aceptado: "menu"

// Exportar el handler
export default handler;
