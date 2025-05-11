import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { text }) => {
    if (!text) throw 'Por favor, ingresa el enlace del video de TikTok (modo presentación).';

    const urls = [
        `https://dlpanda.com/id?url=${encodeURIComponent(text)}&token=G7eRpMaa`,
        `https://dlpanda.com/id?url=${encodeURIComponent(text)}&token51=G32254GLM09MN89Maa`
    ];

    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36';

    let imgUrls = [];

    for (let url of urls) {
        try {
            let res = await axios.get(url, {
                headers: {
                    'User-Agent': userAgent,
                    'Accept': 'text/html',
                }
            });

            const $ = cheerio.load(res.data);
            $('div.col-md-12 > img').each((i, el) => {
                const src = $(el).attr('src');
                if (src) imgUrls.push(src);
            });

            if (imgUrls.length) break;

        } catch (e) {
            console.log(`Error al intentar con ${url}:`, e.message);
        }
    }

    if (!imgUrls.length) throw 'No se pudieron obtener imágenes. Asegúrate de que el link sea válido y en modo presentación.';

    for (let url of imgUrls) {
        await conn.sendFile(m.chat, url, 'slide.jpg', `/* Imagen descargada desde TikTok */`, m);
    }
};

handler.command = /^tkslide|tiktokslide$/i;
handler.help = ['tkslide <link>'];
handler.tags = ['downloader'];

export default handler;