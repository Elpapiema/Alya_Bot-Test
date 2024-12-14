import fs from 'fs';

const filePath = './personalize.json';

const handler = async (m, { isOwner, sender }) => {
    try {
        if (!isOwner) {
            return m.reply("❌ Solo los administradores del bot pueden restablecer sus preferencias.");
        }

        // Comprobar si el archivo existe
        if (!fs.existsSync(filePath)) {
            return m.reply("⚠️ No se encontraron preferencias guardadas.");
        }

        // Leer el archivo personalize.json
        let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Eliminar las personalizaciones del owner que ejecuta el comando
        if (data.owners[sender]) {
            delete data.owners[sender]; // Eliminar la personalización del owner
        } else {
            return m.reply("⚠️ No se encontraron preferencias personalizadas para tu cuenta.");
        }

        // Guardar los cambios en el archivo
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        // Confirmar al owner que su personalización ha sido restablecida
        m.reply("✅ Tu personalización ha sido restablecida a los valores predeterminados.");
    } catch (error) {
        console.error(`[ERROR] resetpreferences: ${error.message}`);
        m.reply("❌ Ocurrió un error al intentar restablecer las preferencias.");
    }
};

handler.help = ['resetpreferences'];
handler.tags = ['personalizacion'];
handler.command = /^(resetpreferences)$/i;

export default handler;