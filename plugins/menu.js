import fs from 'fs';

const filePath = './personalize.json';
const defaultData = {
    botName: "Alya Mikhailovna Kujou",
    currency: "yen",
    videos: [
        "https://qu.ax/WgJR.mp4",
        "https://qu.ax/kOwY.mp4",
        "https://qu.ax/UYGf.mp4"
    ]
};

let handler = async (m, { conn, isOwner }) => {
    try {
        if (!fs.existsSync(filePath)) {
            const initialData = { default: defaultData, owners: {}, users: {} };
            fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
        }

        const config = JSON.parse(fs.readFileSync(filePath));

        // Identificar si el usuario es un owner
        const ownerConfig = config.owners[m.sender] || null;

        // Si el usuario es un owner, la configuración de ese owner se aplicará a todos sus usuarios
        const inheritedOwnerConfig = ownerConfig 
            ? ownerConfig // Si el owner tiene personalización, usarla
            : null;

        // Usar la configuración del owner o los valores predeterminados si no hay configuración del owner
        const botName = inheritedOwnerConfig?.botName || defaultData.botName;
        const currency = inheritedOwnerConfig?.currency || defaultData.currency;
        const videos = inheritedOwnerConfig?.videos || defaultData.videos;

        // Verificación: asegurarnos de que la lista de videos tiene contenido
        if (!Array.isArray(videos) || videos.length === 0) {
            throw new Error("No videos found in the configuration.");
        }

        const randomVideoUrl = videos[Math.floor(Math.random() * videos.length)];

        const menuMessage = `
┎┈┈┈┈┈┈┈┈୨ Ｉｎｆｏ ୧┈┈┈┈┈┈┈┈┒


   ✦ Desarrollado por: 𝓔𝓶𝓶𝓪 (𝓥𝓲𝓸𝓵𝓮𝓽'𝓼 𝓥𝓮𝓻𝓼𝓲𝓸𝓷)

   ✦ Versión actual: ${vs}

┈┈┈┈┈┈┈┈┈┈┈┈୨♡୧┈┈┈┈┈┈┈┈┈┈┈┈
   *Hola!* soy ${botName}, aquí tienes la lista de comandos
   ✦ *La Moneda actual es :* ${currency}

┈┈┈┈┈┈┈┈┈┈┈┈୨♡୧┈┈┈┈┈┈┈┈┈┈┈┈
> 𝙿𝚎𝚛𝚜𝚘𝚗𝚊𝚕𝚒𝚣𝚊𝚌𝚒𝚘𝚗   (ノ^o^)ノ  

 ❀ .setname 
 ❀ .setbanner
 ❀ .setmoneda
 ❀ .viewbanner
 ❀ .deletebanner
 ❀ .resetpreferences

┈┈┈┈┈┈┈┈┈┈┈┈୨♡୧┈┈┈┈┈┈┈┈┈┈┈┈
> 𝚁𝚊𝚗𝚍𝚘𝚖   (ノ^o^)ノ  

 ❀ .rw ➩ .rollwaifu 
 ❀ .c ➩ .claim
 ❀ .harem
┈┈┈┈┈┈┈┈┈┈┈┈୨♡୧┈┈┈┈┈┈┈┈┈┈┈┈
> 𝙳𝚎𝚜𝚌𝚊𝚛𝚐𝚊𝚜   (ノ^o^)ノ  

  ❀ .play ➩ _nombre de la cancion ➩_ (audio)
  ❀ .play2 ➩ _nombre de la cancion_ (video)

┖┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┚
`;

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