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

        // Leer la configuración del archivo
        const config = JSON.parse(fs.readFileSync(filePath));

        // Obtener las configuraciones personalizadas del usuario, o usar las predeterminadas
        const userConfig = config.users[m.sender] || config.default;

        // Seleccionar un video aleatoriamente
        const randomVideoUrl = userConfig.videos[Math.floor(Math.random() * userConfig.videos.length)];

        // Texto del mensaje del menú con personalización o datos predeterminados
        const menuMessage = `
┎┈┈┈┈┈┈┈┈୨ Ｉｎｆｏ ୧┈┈┈┈┈┈┈┈┒


   ✦ Desarrollado por: 𝓔𝓶𝓶𝓪 (𝓥𝓲𝓸𝓵𝓮𝓽'𝓼 𝓥𝓮𝓻𝓼𝓲𝓸𝓷)
   ✦ Versión actual: ${vs}
┈┈┈┈┈┈┈┈┈┈┈┈୨♡୧┈┈┈┈┈┈┈┈┈┈┈┈
   *Hola!* soy ${userConfig.botName} aqui tenes la lista de comandos
   ✦ *La Moneda actual es :* ${userConfig.currency}
┈┈┈┈┈┈┈┈┈┈┈┈୨♡୧┈┈┈┈┈┈┈┈┈┈┈┈
   > Perzonalizacion

   .setname 
   .setbanner
   .setmoneda
   .viewbanner
   .deletebanner
   .resetpreferences
┈┈┈┈┈┈┈┈┈┈┈┈୨♡୧┈┈┈┈┈┈┈┈┈┈┈┈
   > Random

   .rw .rollwaifu
   .c .claim
   .harem
┈┈┈┈┈┈┈┈┈┈┈┈୨♡୧┈┈┈┈┈┈┈┈┈┈┈┈
> Descargas

.play _nombre de la cancion_ (audio)
.play2 _nombre de la cancion_ (video)

┖┈┈┈┈┈┈┈┈┈┈┈┈୨♡୧┈┈┈┈┈┈┈┈┈┈┈┈┚`;

        // Enviar el video aleatorio como GIF
        await conn.sendMessage(
            m.chat,
            {
                video: { url: randomVideoUrl },
                gifPlayback: true,
                caption: menuMessage,
                mentions: [m.sender]
            }
        );
    } catch (error) {
        conn.reply(m.chat, `❌ Error al cargar el menú: ${error.message}`, m);
    }
};

handler.help = ['menu'];
handler.tags = ['info'];
handler.command = /^(menu)$/i;

export default handler;
