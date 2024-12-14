import fs from 'fs';

const filePath = './personalize.json';

const handler = async (m, { isOwner, text }) => {
    try {
        if (!isOwner) {
            return m.reply("❌ Solo los administradores del bot pueden eliminar banners.");
        }

        if (!fs.existsSync(filePath)) {
            return m.reply("⚠️ El archivo personalize.json no existe. No hay banners personalizados.");
        }

        if (!text) {
            return m.reply("❌ Debes proporcionar el enlace del video que deseas eliminar.");
        }

        // Leer el archivo personalize.json
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Obtener el ID del owner
        const ownerId = m.sender;

        if (!data.owners[ownerId] || !data.owners[ownerId].videos) {
            return m.reply("⚠️ No tienes banners personalizados para eliminar.");
        }

        // Buscar y eliminar el video específico
        const videoIndex = data.owners[ownerId].videos.indexOf(text);
        if (videoIndex === -1) {
            return m.reply("⚠️ El video proporcionado no está en tu lista de banners personalizados.");
        }

        data.owners[ownerId].videos.splice(videoIndex, 1);

        // Verificar si la lista de videos quedó vacía y eliminar la clave si es necesario
        if (data.owners[ownerId].videos.length === 0) {
            delete data.owners[ownerId].videos;
        }

        // Guardar los cambios en personalize.json
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        m.reply("✅ El video ha sido eliminado de tus banners personalizados.");
    } catch (error) {
        console.error(`[ERROR] delbanner: ${error.message}`);
        m.reply("❌ Ocurrió un error al intentar eliminar el banner.");
    }
};

handler.help = ['delbanner'];
handler.tags = ['personalizacion'];
handler.command = /^(delbanner|deletebanner)$/i;

export default handler;