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

        // Comprobar si el usuario tiene configuraciones personalizadas
        if (!config.users[m.sender]) {
            return conn.reply(m.chat, '❌ No tienes configuraciones personalizadas para restablecer.', m);
        }

        // Eliminar la personalización del usuario
        delete config.users[m.sender];

        // Guardar los cambios en el archivo
        fs.writeFileSync(filePath, JSON.stringify(config, null, 2));

        conn.reply(m.chat, '✅ Todas tus preferencias han sido restablecidas a los valores predeterminados.', m);
    } catch (error) {
        conn.reply(m.chat, `❌ Error al restablecer tus preferencias: ${error.message}`, m);
    }
};

handler.help = ['resetpreferences', 'reiniciarpreferencias'];
handler.tags = ['info'];
handler.command = /^(resetpreferences|reiniciarpreferencias)$/i;

export default handler;
