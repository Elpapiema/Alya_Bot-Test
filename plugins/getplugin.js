import fs from 'fs';
import axios from 'axios';
import path from 'path';
import AdmZip from 'adm-zip';

const storeFilePath = './store.json';
const pluginsDir = './plugins/';

let handler = async (m, { conn, text, isAdmin, isOwner }) => {
    try {
        // Verificar si el usuario es administrador u owner
        if (!isAdmin && !isOwner) {
            return conn.reply(
                m.chat,
                '❌ Este comando solo puede ser usado por administradores.',
                m
            );
        }

        // Verificar si se especificó el nombre del plugin/paquete
        if (!text) {
            return conn.reply(
                m.chat,
                '❌ Por favor, especifica el nombre del plugin o paquete. Ejemplo: *getplugin Sticker Maker*',
                m
            );
        }

        // Verificar si el archivo de la tienda existe
        if (!fs.existsSync(storeFilePath)) {
            return conn.reply(
                m.chat,
                '❌ La tienda de plugins no está disponible en este momento.',
                m
            );
        }

        // Leer el archivo store.json
        const storeData = JSON.parse(fs.readFileSync(storeFilePath, 'utf-8'));

        // Buscar el plugin o paquete solicitado
        let item =
            storeData.plugins.find((p) => p.name.toLowerCase() === text.toLowerCase()) ||
            storeData.packages.find((p) => p.name.toLowerCase() === text.toLowerCase());

        if (!item) {
            return conn.reply(
                m.chat,
                `❌ El elemento "${text}" no se encuentra en la tienda.`,
                m
            );
        }

        // Verificar si el elemento tiene un enlace válido
        if (!item.link) {
            return conn.reply(
                m.chat,
                `❌ El elemento "${item.name}" no tiene un enlace disponible.`,
                m
            );
        }

        conn.reply(m.chat, `🔄 Descargando e instalando: *${item.name}*...`, m);

        // Descargar el archivo desde el enlace
        const response = await axios.get(item.link, { responseType: 'arraybuffer' });
        const fileBuffer = Buffer.from(response.data);

        // Identificar si es un archivo JS o un ZIP
        if (storeData.packages.some((p) => p.name.toLowerCase() === text.toLowerCase())) {
            // Es un paquete ZIP
            const zip = new AdmZip(fileBuffer);
            zip.extractAllTo(pluginsDir, true); // Extraer directamente en la carpeta "plugins"
            conn.reply(
                m.chat,
                `✅ El paquete *${item.name}* ha sido descargado e instalado correctamente.`,
                m
            );
        } else if (storeData.plugins.some((p) => p.name.toLowerCase() === text.toLowerCase())) {
            // Es un archivo JS (plugin único)
            const pluginFilePath = `${pluginsDir}${item.name.replace(/ /g, '_').toLowerCase()}.js`;
            fs.writeFileSync(pluginFilePath, fileBuffer);
            conn.reply(
                m.chat,
                `✅ El plugin *${item.name}* ha sido descargado e instalado correctamente.`,
                m
            );
        } else {
            conn.reply(
                m.chat,
                `❌ El formato del archivo para *${item.name}* no es válido.`,
                m
            );
        }
    } catch (error) {
        console.error(error);
        conn.reply(
            m.chat,
            '❌ Ocurrió un error al instalar el elemento. Por favor, verifica el enlace o inténtalo más tarde.',
            m
        );
    }
};

handler.help = ['getplugin'];
handler.tags = ['admin'];
handler.command = /^(getplugin)$/i;
handler.admin = true;

export default handler;