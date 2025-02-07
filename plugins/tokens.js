import handler from '../handler.js';
import '../config.js'; // Asegura que global.owner esté disponible

handler.command = ['gettoken'];

handler.run = async (m, { conn }) => {
    if (!global.owner.includes(m.sender)) {
        return m.reply('❌ No tienes permiso para usar este comando.');
    }

    const token = generateToken(8);
    m.reply(`🔑 Token generado: *${token}*`);
};

function generateToken(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

export default handler;
