import fs from 'fs';

const filePath = './personalize.json';

const handler = async (m, { text, isOwner }) => {
    try {
        if (!isOwner) {
            return m.reply("❌ Solo los administradores del bot pueden cambiar la moneda.");
        }

        if (!text) {
            return m.reply("⚠️ Por favor, proporciona la nueva moneda para el bot. Ejemplo:\n*.setmoneda dólar*");
        }

        // Leer el archivo personalize.json
        let data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : { owners: {}, default: {} };

        // Obtener el ID del owner
        const ownerId = m.sender;

        // Asegurarse de que la estructura exista
        if (!data.owners[ownerId]) {
            data.owners[ownerId] = {};
        }

        // Actualizar la moneda del bot
        data.owners[ownerId].currency = text;

        // Guardar cambios en el archivo personalize.json
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        // Confirmar al usuario
        m.reply(`✅ La moneda del bot ha sido actualizada exitosamente a: *${text}*`);
    } catch (error) {
        console.error(`[ERROR] setmoneda: ${error.message}`);
        m.reply("❌ Ocurrió un error al intentar cambiar la moneda del bot.");
    }
};

handler.help = ['setmoneda'];
handler.tags = ['personalizacion'];
handler.command = /^(setmoneda)$/i;

export default handler;