import fetch from 'node-fetch';

const API_URL = 'https://api.alya-host.shop/download_video?url=';

async function fetchVideo() {
    try {
        let response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Error en la API: ${response.statusText}`);

        let data = await response.json();

        if (data.error === "Falta el parámetro URL") {
            console.log('✅ Respuesta correcta:', data);
        } else {
            console.error('⚠️ Respuesta inesperada:', data);
        }
    } catch (error) {
        console.error('❌ Error al hacer la solicitud:', error);
    }
}

// Ejecutar cada 3 minutos (180000 ms)
setInterval(fetchVideo, 180000);

export default {}; // Necesario para que el bot lo cargue como plugin