const handler = async (m, { conn }) => {
    m.reply('¡Este es un comando exclusivo para administradores!');
};

handler.command = ['adminonly'];
handler.admin = true; // Esto indica que solo los admins pueden usarlo

export default handler;