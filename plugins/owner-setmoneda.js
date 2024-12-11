import fs from 'fs';

const filePath = './personalize.json';
const defaultCurrency = "yen";

let handler = async (m, { conn, args, command, isOwner }) => {
    try {
        // Verificar si el usuario tiene permisos (solo los dueños del bot pueden usar este comando)
        if (!isOwner) return conn.reply(m.chat, '❌ Solo los propietarios del bot pueden usar este comando.', m);

        // Verificar si el archivo existe, si no, crearlo con valores predeterminados
        if (!fs.existsSync(filePath)) {
            const initialData = {
                botName: "Alya Mikhailovna Kujou",
                currency: defaultCurrency,
                videos: [
                    'https://qu.ax/WgJR.mp4',
                    'https://qu.ax/kOwY.mp4',
                    'https://qu.ax/UYGf.mp4'
                ]
            };
            fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
        }

        // Cargar el archivo JSON
        let config = JSON.parse(fs.readFileSync(filePath));

        // Validar argumentos
        if (args.length === 0) {
            return conn.reply(m.chat, '❌ Por favor, proporciona una nueva moneda para el bot.', m);
        }

        const newCurrency = args.join(' '); // Moneda con soporte para espacios

        // Actualizar la moneda en la configuración
        config.currency = newCurrency;

        // Guardar el archivo actualizado
        fs.writeFileSync(filePath, JSON.stringify(config, null, 2));

        // Responder al usuario
        conn.reply(m.chat, `✅ Moneda del bot cambiada correctamente a: *${newCurrency}*`, m);
    } catch (error) {
        conn.reply(m.chat, `❌ Error al cambiar la moneda del bot: ${error.message}`, m);
    }
};

// Configuración del comando
handler.help = ['setmoneda', 'setbotmoneda'];
handler.tags = ['owner'];
handler.command = /^(setmoneda|setbotmoneda)$/i; // Comandos aceptados
handler.owner = true; // Solo propietarios del bot

export default handler;
