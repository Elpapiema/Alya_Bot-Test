import { delay } from 'utils';

const writingTimeout = 10000; // 10 segundos
let typingTimeout = null;

const handler = async (m, { conn, prefix }) => {
    try {
        const messageText = m.text || "";
        
        // Verificar si el mensaje contiene el prefijo
        if (messageText.startsWith(prefix)) {
            // Mostrar "escribiendo"
            await conn.sendPresenceUpdate('composing', m.chat);
            
            // Cancelar el tiempo de espera anterior si lo hay
            if (typingTimeout) clearTimeout(typingTimeout);

            // Establecer un temporizador para detener el "escribiendo" después de 10 segundos
            typingTimeout = setTimeout(() => {
                conn.sendPresenceUpdate('paused', m.chat); // Detener estado de "escribiendo"
            }, writingTimeout);
        }
        
        // Aquí agregarías la lógica para procesar el mensaje y responder, si lo deseas
        // Si el bot responde, también detener el estado de "escribiendo"
        // Ejemplo de respuesta:
        await conn.sendMessage(m.chat, { text: 'Tu mensaje ha sido recibido.' });

        // Detener el estado de "escribiendo" después de que el bot envíe un mensaje
        conn.sendPresenceUpdate('paused', m.chat);
    } catch (error) {
        console.error(error);
    }
};

handler.command = /./; // Se ejecuta para cualquier mensaje (sin comando específico)

export default handler;
