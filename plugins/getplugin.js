import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';  // Asegúrate de tener esta dependencia instalada

// URL del JSON con la tienda de plugins
const storeUrl = 'https://raw.githubusercontent.com/Elpapiema/Adiciones-para-AlyaBot-RaphtaliaBot-/refs/heads/main/plugin_Store/store.json';

let handler = async (m, { conn, text, isAdmin, isOwner }) => {
    const args = text.split(' ').slice(1); // Obtener el argumento (nombre del plugin o paquete)
    if (args.length < 1) {
        conn.reply(m.chat, 'Por favor, proporciona el nombre del plugin que deseas instalar.', m);
        return;
    }

    const pluginName = args.join(' ');  // Nombre del plugin o paquete

    try {
        // Obtenemos los datos del JSON de la tienda
        const response = await fetch(storeUrl);
        const storeData = await response.json();

        // Buscamos el plugin en la lista de plugins
        const plugin = storeData.plugins.find(p => p.name.toLowerCase() === pluginName.toLowerCase());
        if (plugin) {
            // Si es un plugin individual, descargamos el archivo .js
            const pluginFile = await fetch(plugin.link);
            const pluginContent = await pluginFile.text();
            const pluginPath = path.join(__dirname, 'plugins', `${pluginName}.js`);

            // Guardamos el archivo del plugin en la carpeta 'plugins'
            fs.writeFileSync(pluginPath, pluginContent);
            conn.reply(m.chat, `Plugin ${pluginName} instalado correctamente.`, m);
        } else {
            // Si no se encuentra en plugins, buscamos en los paquetes
            const package = storeData.packages.find(p => p.name.toLowerCase() === pluginName.toLowerCase());
            if (package) {
                // Si es un paquete comprimido, descargamos el archivo .zip
                const zipFile = await fetch(package.link);
                const buffer = await zipFile.buffer();
                const zip = new AdmZip(buffer);

                // Extraemos el paquete en la carpeta 'plugins'
                zip.extractAllTo(path.join(__dirname, 'plugins'), true);
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
handler.help = ['getplugin'];
handler.tags = ['admin'];
handler.command = /^(getplugin)$/i;
handler.admin = true;

export default handler;