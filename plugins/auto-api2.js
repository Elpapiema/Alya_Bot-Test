import fetch from 'node-fetch';

const API_URL = 'https://two1-9w16.onrender.com';

async function fetchVideo() {
    try {
        let response = await fetch(API_URL);

        if (response.status === 200) {
            console.log('✅ Respuesta correcta: Código 200');
            return;
        }

        let data = await response.json();

        if (data.error === "Falta el parámetro URL") {
            console.log('✅ Respuesta correcta:', data);
        } else {
            console.error('⚠️ Respuesta inesperada:', data);
        }
    } catch (error) {
        console.error('❌ Error inesperado:', error);
    }
}

// Ejecutar cada 3 minutos (180000 ms)
setInterval(fetchVideo, 180000);

export default {}; // Necesario para que el bot lo cargue como plugin