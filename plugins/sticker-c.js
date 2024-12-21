import fs from 'fs';
import path from 'path';
import { sticker } from '../lib/sticker.js'; // Asegúrate de tener una función `sticker` que maneje el proceso de conversión.

const handler = async (m, { conn, command }) => {
    // Verifica si se está respondiendo a un mensaje con imagen.
    if (!m.quoted || !m.quoted.mimetype || !m.quoted.mimetype.startsWith('image/')) {
        return conn.reply(m.chat, '❌ Por favor, responde a una imagen para crear un sticker.', m);
    }

    try {
        // Descarga la imagen adjunta al mensaje respondido.
        const media = await m.quoted.download();
        if (!media) throw new Error('No se pudo descargar la imagen.');

        // Obtén el nickname del usuario o un valor por defecto.
        const nickname = m.pushName || 'Usuario desconocido';

        // Convierte la imagen a un sticker.
        const stickerBuffer = await sticker(media, { pack: nickname, author: 'Alya Bot' });

        // Envía el sticker.
        await conn.sendMessage(m.chat, { sticker: stickerBuffer });
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Ocurrió un error al crear el sticker.', m);
    }
};

handler.help = ['s', 'sticker'];
handler.tags = ['sticker'];
handler.command = /^(s|sticker)$/i;

export default handler;
