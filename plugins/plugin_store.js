import axios from 'axios';

const storeUrl =
  'https://raw.githubusercontent.com/Elpapiema/Adiciones-para-AlyaBot-RaphtaliaBot-/refs/heads/main/plugin_Store/store.json';

let handler = async (m, { conn }) => {
  try {
    conn.reply(m.chat, '🔄 Cargando la tienda de plugins...', m);

    // Obtener el JSON desde el enlace
    const response = await axios.get(storeUrl);
    const storeData = response.data;

    // Verificar si hay datos en las categorías
    const plugins = storeData.plugins || [];
    const packages = storeData.packages || [];

    if (plugins.length === 0 && packages.length === 0) {
      return conn.reply(m.chat, '❌ No hay elementos disponibles en la tienda en este momento.', m);
    }

    // Construir mensaje para Plugins Disponibles
    let pluginsMessage = '📂 *Plugins Disponibles:*\n\n';
    if (plugins.length > 0) {
      plugins.forEach((p, i) => {
        pluginsMessage += `*${i + 1}.* ${p.name}\n`;
        pluginsMessage += `   📌 ${p.description}\n\n`;
      });
    } else {
      pluginsMessage += 'No hay plugins disponibles actualmente.\n\n';
    }

    // Construir mensaje para Paquetes de Plugins
    let packagesMessage = '📦 *Paquetes de Plugins:*\n\n';
    if (packages.length > 0) {
      packages.forEach((p, i) => {
        packagesMessage += `*${i + 1}.* ${p.name}\n`;
        packagesMessage += `   📌 ${p.description}\n\n`;
      });
    } else {
      packagesMessage += 'No hay paquetes de plugins disponibles actualmente.\n\n';
    }

    // Enviar mensaje al usuario
    const fullMessage = `${pluginsMessage}${packagesMessage}`;
    conn.reply(m.chat, fullMessage.trim(), m);
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '❌ Ocurrió un error al cargar la tienda de plugins. Intenta nuevamente más tarde.', m);
  }
};

handler.help = ['store', 'pluginstore', 'tienda'];
handler.tags = ['admin'];
handler.command = /^(store|pluginstore|tienda)$/i;

export default handler;
