import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, text }) => {
    // Elimina el comando y extrae el nombre del plugin
    const pluginName = text.replace(/^(getplugin)\s+/i, '').trim();

    // Verificar si el nombre del plugin fue proporcionado
    if (!pluginName) {
        conn.reply(m.chat, 'Por favor, proporciona el nombre del plugin que deseas instalar.', m);
        return;
    }

    try {
        // Obtener el JSON de la tienda
        const storeUrl = 'https://raw.githubusercontent.com/Elpapiema/Adiciones-para-AlyaBot-RaphtaliaBot-/refs/heads/main/plugin_Store/store.json';
        const response = await fetch(storeUrl);
        const storeData = await response.json();

        // Buscar el plugin en la tienda
        const plugin = storeData.plugins.find(p => p.name.toLowerCase() === pluginName.toLowerCase());
        if (!plugin) {
            conn.reply(m.chat, `El plugin "${pluginName}" no se encuentra en la tienda.`, m);
            return;
        }

        // Descargar el plugin desde el enlace proporcionado
        const pluginFile = await fetch(plugin.link);
        const pluginContent = await pluginFile.text();

        // Guardar el archivo del plugin en la carpeta 'plugins'
        const pluginsFolder = path.join(__dirname, 'plugins');
        const pluginPath = path.join(pluginsFolder, `${pluginName}.js`);
        
        // Asegurarse de que la carpeta de plugins existe
        if (!fs.existsSync(pluginsFolder)) {
            fs.mkdirSync(pluginsFolder);
        }

        fs.writeFileSync(pluginPath, pluginContent);

        conn.reply(m.chat, `✅ Plugin "${pluginName}" instalado correctamente.`, m);
    } catch (error) {
        console.error('Error al obtener el plugin:', error);
        conn.reply(m.chat, '⚠️ Hubo un error al intentar obtener el plugin. Intenta nuevamente más tarde.', m);
    }
};

// Definición del comando
handler.command = /^(getplugin)$/i;
handler.admin = false;
handler.botAdmin = false;

export default handler;