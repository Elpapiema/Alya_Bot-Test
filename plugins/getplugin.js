import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const storeUrl = 'https://raw.githubusercontent.com/Elpapiema/Adiciones-para-AlyaBot-RaphtaliaBot-/refs/heads/main/plugin_Store/store.json';

let handler = async (m, { conn, text }) => {
    const args = text.trim().split(' ');
    if (args.length < 2) {
        conn.reply(m.chat, 'Por favor, proporciona el nombre del plugin que deseas instalar.', m);
        return;
    }

    const pluginName = args.slice(1).join(' ').toLowerCase();

    try {
        // Obtener los datos del JSON de la tienda
        const response = await fetch(storeUrl);
        const storeData = await response.json();

        // Buscar el plugin
        const plugin = storeData.plugins.find(p => p.name.toLowerCase() === pluginName);
        if (plugin) {
            // Descargar el archivo del plugin
            const pluginFile = await fetch(plugin.link);
            const pluginContent = await pluginFile.text();

            // Guardar el archivo en la carpeta 'plugins'
            const pluginPath = path.join(__dirname, 'plugins', `${pluginName}.js`);
            fs.writeFileSync(pluginPath, pluginContent);
            conn.reply(m.chat, `Plugin ${pluginName} instalado correctamente.`, m);
        } else {
            // Buscar en los paquetes
            const package = storeData.packages.find(p => p.name.toLowerCase() === pluginName);
            if (package) {
                const zipFile = await fetch(package.link);
                const buffer = await zipFile.buffer();
                const zip = require('adm-zip');
                const zipInstance = new zip(buffer);
                zipInstance.extractAllTo(path.join(__dirname, 'plugins'), true);
                conn.reply(m.chat, `Paquete ${pluginName} instalado correctamente.`, m);
            } else {
                conn.reply(m.chat, `El plugin o paquete ${pluginName} no se encuentra en la tienda.`, m);
            }
        }
    } catch (error) {
        console.error('Error al obtener el plugin:', error);
        conn.reply(m.chat, 'Hubo un error al intentar obtener el plugin. Intenta nuevamente más tarde.', m);
    }
}

// Definición del comando
handler.command = /^(getplugin)$/i;
handler.admin = true;

export default handler;