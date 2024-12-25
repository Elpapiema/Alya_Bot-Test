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

  const plugins = storeData.plugins || [];
  const packages = storeData.packages || [];

  if (plugins.length === 0 && packages.length === 0) {
    return conn.reply(m.chat, '❌ No hay elementos disponibles en la tienda en este momento.', m);
  }

  // Construir mensaje con todos los elementos
  let storeMessage = '🛒 *Tienda de Plugins:*\n\n';

  // Agregar plugins al mensaje
  plugins.forEach((plugin, i) => {
    storeMessage += `*${i + 1}. Plugin: ${plugin.name}*\n`;
    storeMessage += `   📌 ${plugin.description}\n`;
    storeMessage += `   💲 ${plugin.price}\n\n`;
  });

  // Agregar paquetes al mensaje
  packages.forEach((pack, i) => {
    storeMessage += `*${plugins.length + i + 1}. Paquete: ${pack.name}*\n`;
    storeMessage += `   📌 ${pack.description}\n`;
    storeMessage += `   💲 ${pack.price}\n\n`;
  });

  // Enviar mensaje al usuario
  conn.reply(m.chat, storeMessage.trim(), m);
};

handler.help = ['store', 'pluginstore', 'tienda'];
handler.tags = ['admin'];
handler.command = /^(store|pluginstore|tienda)$/i;

export default handler;