import fs from 'fs';

const filePath = './personalize.json';

const handler = async (m, { text, isOwner }) => {
    try {
        if (!isOwner) {
            return m.reply("❌ Solo los administradores del bot pueden cambiar el nombre del bot.");
        }

        if (!text) {
            return m.reply("⚠️ Por favor, proporciona un nuevo nombre para el bot. Ejemplo:\n*.setname Alya Bot*");
        }

        // Leer el archivo personalize.json
        let data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : { owners: {}, default: {} };

        // Obtener el ID del owner
        const ownerId = m.sender;

        // Asegurarse de que la estructura exista
        if (!data.owners[ownerId]) {
            data.owners[ownerId] = {};
        }

        // Actualizar el nombre del bot
        data.owners[ownerId].botName = text;

        // Guardar cambios en el archivo personalize.json
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        // Confirmar al usuario
        m.reply(`✅ El nombre del bot ha sido actualizado exitosamente a: *${text}*`);
    } catch (error) {
        console.error(`[ERROR] setname: ${error.message}`);
        m.reply("❌ Ocurrió un error al intentar cambiar el nombre del bot.");
    }
};

handler.help = ['setname'];
handler.tags = ['personalizacion'];
handler.command = /^(setname)$/i;

export default handler;