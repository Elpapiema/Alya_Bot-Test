import fs from 'fs';

const filePath = './personalize.json';

const handler = async (m, { isOwner }) => {
    try {
        if (!isOwner) {
            return m.reply("❌ Solo los administradores del bot pueden ver los banners personalizados.");
        }

        if (!fs.existsSync(filePath)) {
            return m.reply("⚠️ El archivo personalize.json no existe. No hay banners personalizados.");
        }

        // Leer el archivo personalize.json
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Obtener el ID del owner
        const ownerId = m.sender;

        if (!data.owners[ownerId] || !data.owners[ownerId].videos || data.owners[ownerId].videos.length === 0) {
            return m.reply("⚠️ No tienes banners personalizados.");
        }

        // Obtener la lista de videos del owner
        const videoList = data.owners[ownerId].videos.map((video, index) => `${index + 1}. ${video}`).join('\n');

        // Enviar la lista de banners
        m.reply(`📜 *Tus banners personalizados:*\n\n${videoList}`);
    } catch (error) {
        console.error(`[ERROR] verbanner: ${error.message}`);
        m.reply("❌ Ocurrió un error al intentar mostrar los banners.");
    }
};

handler.help = ['verbanner'];
handler.tags = ['personalizacion'];
handler.command = /^(verbanner|viewbanner)$/i;

export default handler;