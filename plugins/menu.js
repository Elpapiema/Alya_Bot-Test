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

        // Si el usuario es un owner, toma su configuración. Si no, hereda la configuración del owner o usa la predeterminada.
        const ownerConfig = config.owners[m.sender] || null;
        const defaultConfig = config.default;

        // Los usuarios comunes siempre heredarán la configuración del owner si existe.
        const inheritedOwnerConfig = ownerConfig 
            ? config.owners[Object.keys(config.owners).find((id) => id === m.sender)] 
            : null;

        // Si no hay personalización del owner, se utilizan los valores predeterminados.
        const botName = inheritedOwnerConfig?.botName || defaultConfig.botName;
        const currency = inheritedOwnerConfig?.currency || defaultConfig.currency;
        const videos = inheritedOwnerConfig?.videos || defaultConfig.videos;

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

┖┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┚
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