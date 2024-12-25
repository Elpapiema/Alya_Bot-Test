import fetch from 'node-fetch';
import axios from 'axios';

const storeUrl =
  'https://raw.githubusercontent.com/Elpapiema/Adiciones-para-AlyaBot-RaphtaliaBot-/refs/heads/main/plugin_Store/store.json';

let handler = async (m, { conn }) => {
  conn.reply(m.chat, '🔄 Cargando la tienda de plugins...', m);

  let storeData;

  try {
    // Intentar obtener el JSON con node-fetch
    const response = await fetch(storeUrl);
    if (!response.ok) throw new Error('Error al obtener datos con fetch');
    storeData = await response.json();
  } catch (fetchError) {
    console.error('node-fetch falló, intentando con axios...', fetchError);

    try {
      // Si node-fetch falla, intentar con axios
      const response = await axios.get(storeUrl);
      storeData = response.data;
    } catch (axiosError) {
      console.error('axios también falló:', axiosError);
      return conn.reply(
        m.chat,
        '❌ Ocurrió un error al cargar la tienda de plugins. Intenta nuevamente más tarde.',
        m
      );
    }
  }

  // Continuar con el manejo de la tienda
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
};

handler.help = ['store', 'pluginstore', 'tienda'];
handler.tags = ['admin'];
handler.command = /^(store|pluginstore|tienda)$/i;

export default handler;