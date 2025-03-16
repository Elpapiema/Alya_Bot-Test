import fs from 'fs';

const filePath = './personalize.json';

let handler = async (m, { conn }) => {
    try {
        const data = JSON.parse(fs.readFileSync(filePath));

        // Cargar datos globales y predeterminados
        const globalConfig = data.global;
        const defaultConfig = data.default;

        const botName = globalConfig.botName || defaultConfig.botName;
        const currency = globalConfig.currency || defaultConfig.currency;
        const videos = globalConfig.videos.length > 0 ? globalConfig.videos : defaultConfig.videos;

        const randomVideoUrl = videos[Math.floor(Math.random() * videos.length)];

        const menuMessage = `
/*┎───•✧•───⌬
┃
┃   ✦ Desarrollado por: 𝓔𝓶𝓶𝓪 (𝓥𝓲𝓸𝓵𝓮𝓽'𝓼 𝓥𝓮𝓻𝓼𝓲𝓸𝓷)
┃
┃   ✦ Versión actual: ${vs}
┃
┖───•✧•

   *Hola!* soy ${botName}, aquí tienes la lista de comandos
   ✦ *La Moneda actual es :* ${currency}

┎───•✧•───⌬
┃ 𝙿𝚎𝚛𝚜𝚘𝚗𝚊𝚕𝚒𝚣𝚊𝚌𝚒𝚘𝚗   (ノ^o^)ノ  
┃
┃ ❀ .setname 
┃ ❀ .setbanner
┃ ❀ .setmoneda
┃ ❀ .viewbanner
┃ ❀ .deletebanner
┃ ❀ .resetpreferences
┃
┖───•✧•
┎───•✧•───⌬
> 𝚊𝚍𝚖𝚒𝚗𝚒𝚜𝚝𝚛𝚊𝚌𝚒𝚘𝚗   (ノ^o^)ノ 

❀ .ban ➩ .kick _expulsa a los ususarios *Solo para Admins*_
 .getplugin
 .getpack
 .store
┖───•✧•
┎───•✧•───⌬
> 𝚁𝚊𝚗𝚍𝚘𝚖   (ノ^o^)ノ  

 ❀ .rw ➩ .rollwaifu 
 ❀ .c ➩ .claim
 ❀ .harem
   .addrw
┖───•✧•
┎───•✧•───⌬
> 𝙳𝚎𝚜𝚌𝚊𝚛𝚐𝚊𝚜   (ノ^o^)ノ  

  ❀ .play ➩ _nombre de la cancion ➩_ (audio)
  ❀ .play2 ➩ _nombre de la cancion_ (video)
  ❀ .tt ➩ .tiktok ➩ _link de tiktok_ (vídeo)
  ❀ .sp .Spotify _link de Spotify_

┖───•✧•
┎───•✧•───⌬
> 𝚁𝙿𝙶   (ノ^o^)ノ

 ❀ .w .work
 ❀ .slut
   .robar
   .deposit (cantidad)
   .retirar (cantidad)
   .transferir (cantidad) @usuario
   .perfil


> OWNER
   .update
   .dsowner .purgar
┖───•✧•*/
╔═══════════════════🌙  
║   ❀•° ${botName} °•❀  
║   💜 𝑫𝒆𝒔𝒂𝒓𝒓𝒐𝒍𝒍𝒂𝒅𝒐 𝒑𝒐𝒓: ${dev}  
║   🎀 𝑽𝒆𝒓𝒔𝒊ó𝒏: ${vs}  
╚❀•°🌠°•❀═══════════════════  

💬 *¡Hola!* Soy ${botName}, aquí tienes la lista de comandos ✨  
💰 *Moneda actual:* ¥ ${currency}  

╭── ⋆⋅🎀⋅⋆ ──╮  
│ 🎨 𝙿𝙴𝚁𝚂𝙾𝙽𝙰𝙻𝙸𝚉𝙰𝙲𝙸Ó𝙽 🌸  
│ ✧ `.setname`  🖋️  
│ ✧ `.setbanner`  🖼️  
│ ✧ `.setmoneda`  💰  
│ ✧ `.viewbanner`  📜  
│ ✧ `.deletebanner`  🚮  
│ ✧ `.resetpreferences`  🔄  
╰── ⋆⋅🚀⋅⋆ ──╯  

╭── ⋆⋅🎀⋅⋆ ──╮  
│ 🎩 𝙰𝙳𝙼𝙸𝙽𝙸𝚂𝚃𝚁𝙰𝙲𝙸Ó𝙽 ⚙️  
│ ✧ `.ban` ➩ `.kick`  🚫 _Expulsa a los usuarios (Solo Admins)_  
│ ✧ `.getplugin` 🔌  
│ ✧ `.getpack` 📦  
│ ✧ `.store` 🛒  
╰── ⋆⋅🚀⋅⋆ ──╯  

╭── ⋆⋅🎀⋅⋆ ──╮  
│ 🎲 𝚁𝙰𝙽𝙳𝙾𝙼 🎭  
│ ✧ `.rw` ➩ `.rollwaifu` 💖  
│ ✧ `.c` ➩ `.claim` 📜  
│ ✧ `.harem` 💑  
│ ✧ `.addrw` 📝  
╰── ⋆⋅🚀⋅⋆ ──╯  

╭── ⋆⋅🎀⋅⋆ ──╮  
│ 📥 𝙳𝙴𝚂𝙲𝙰𝚁𝙶𝙰𝚂 🎵  
│ ✧ `.play` ➩ _nombre de la canción_ 🎶 _(audio)_  
│ ✧ `.play2` ➩ _nombre de la canción_ 🎥 _(video)_  
│ ✧ `.tt` ➩ `.tiktok` ➩ _link de TikTok_ 🎞️  
│ ✧ `.sp` ➩ `.Spotify` _link de Spotify_ 🎼  
╰── ⋆⋅🚀⋅⋆ ──╯  

╭── ⋆⋅🎀⋅⋆ ──╮  
│ ⚔️ 𝚁𝙿𝙶 🏹  
│ ✧ `.w` ➩ `.work` 💼  
│ ✧ `.slut` 😈  
│ ✧ `.robar` 💰  
│ ✧ `.deposit (cantidad)` 🏦  
│ ✧ `.retirar (cantidad)` 🏧  
│ ✧ `.transferir (cantidad) @usuario` 🔁  
│ ✧ `.perfil` 🆔  
╰── ⋆⋅🚀⋅⋆ ──╯  

╭── ⋆⋅🎀⋅⋆ ──╮  
│ 👑 𝙾𝚆𝙽𝙴𝚁 🛠️  
│ ✧ `.update` 🔄  
│ ✧ `.dsowner` ➩ `.purgar` 🗑️  
╰── ⋆⋅🚀⋅⋆ ──╯  


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

/* estilos de menu

┎───•✧•───⌬
┃
┖───•✧•  */