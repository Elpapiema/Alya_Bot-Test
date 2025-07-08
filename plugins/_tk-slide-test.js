import fetch from 'node-fetch';

let handler = async (m, { conn, args, command }) => {
  if (!args[0]) throw '⚠️ Proporciona la URL de un video de TikTok.\n\nEjemplo:\n.ttsl https://vt.tiktok.com/ZSBy3kxKw/';

  let url = args[0];

  try {
    m.reply('🔄 Obteniendo slides, por favor espera...');

    let apiUrl = `http://api.alyabot.xyz:3269/Tiktok_slidesdl?url=${encodeURIComponent(url)}`;
    let res = await fetch(apiUrl);
    let json = await res.json();

    if (!json.slides || !Array.isArray(json.slides)) throw '❌ No se pudieron obtener las imágenes.';

    let images = json.slides.map(url => ({
      image: { url },
      caption: '🖼 Slide de TikTok',
    }));

    await conn.sendMessage(m.chat, { 
      image: { url: json.slides[0] }, 
      caption: `✅ Imágenes extraídas exitosamente.\nTotal: ${json.slides.length}`,
    }, { quoted: m });

    for (let i = 1; i < json.slides.length; i++) {
      await conn.sendFile(m.chat, json.slides[i], `slide${i}.jpg`, '', m);
    }

  } catch (e) {
    console.error(e);
    throw '❌ Error al procesar la solicitud. Asegúrate de que el enlace sea válido.';
  }
};

handler.help = ['ttsl <url>', 'ttph <url>'];
handler.tags = ['descargas'];
handler.command = ['ttp', 'ttsl', 'ttph'];

export default handler;
