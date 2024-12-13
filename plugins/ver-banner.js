import fs from 'fs';

const filePath = './personalize.json';

let handler = async (m, { isOwner }) => {
    try {
        if (!fs.existsSync(filePath)) throw 'No se encontró el archivo de personalización.';

        const config = JSON.parse(fs.readFileSync(filePath));
        const ownerConfig = config.owners[m.sender];
        const userConfig = config.users[m.sender];
        const defaultConfig = config.default;

        // Jerarquía: Usuario -> Owner -> Default
        const banners = userConfig?.videos || ownerConfig?.videos || defaultConfig.videos;

        if (!banners || banners.length === 0) {
            return m.reply('No hay videos personalizados disponibles.');
        }

        const videoList = banners.map((url, index) => `${index + 1}. ${url}`).join('\n');
        m.reply(`🎥 Videos disponibles:\n\n${videoList}`);
    } catch (error) {
        m.reply(`❌ Error: ${error.message}`);
    }
};

handler.help = ['verbanner', 'viewbanner'];
handler.tags = ['info', 'personalization'];
handler.command = /^(verbanner|viewbanner)$/i;

export default handler;