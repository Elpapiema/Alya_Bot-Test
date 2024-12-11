import fs from 'fs';

const filePath = './personalize.json';
const defaultName = "Alya Mikhailovna Kujou";

let handler = async (m, { conn, args, command, isOwner }) => {
    try {
        // Verificar si el usuario tiene permisos (solo los dueños del bot pueden usar este comando)
        if (!isOwner) return conn.reply(m.chat, '❌ Solo los propietarios del bot pueden usar este comando.', m);

        // Verificar si el archivo existe, si no, crearlo con valores predeterminados
        if (!fs.existsSync(filePath)) {
            const initialData = {
                botName: defaultName,
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
            return conn.reply(m.chat, '❌ Por favor, proporciona un nuevo nombre para el bot.', m);
        }

        const newName = args.join(' '); // Nombre del bot con soporte para espacios

        // Actualizar el nombre en la configuración
        config.botName = newName;

        // Guardar el archivo actualizado
        fs.writeFileSync(filePath, JSON.stringify(config, null, 2));

        // Responder al usuario
        conn.reply(m.chat, `✅ Nombre del bot cambiado correctamente a: *${newName}*`, m);
    } catch (error) {
        conn.reply(m.chat, `❌ Error al cambiar el nombre del bot: ${error.message}`, m);
    }
};

// Configuración del comando
handler.help = ['setname', 'setbotname'];
handler.tags = ['owner'];
handler.command = /^(setname|setbotname)$/i; // Comandos aceptados
handler.owner = true; // Solo propietarios del bot

export default handler;
