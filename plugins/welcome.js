import fetch from 'node-fetch';

export const name = 'welcome';
export const description = 'Plugin de bienvenida para grupos';
export const type = 'event'; // Indica que es un evento, no un comando

export async function handler(client, event) {
    // Verificar que el evento sea GROUP_PARTICIPANT_ADD
    if (event.action !== 'add') return;

    const { participants, id: groupId } = event;

    // Obtener información del grupo
    const groupMetadata = await client.groupMetadata(groupId);
    const groupName = groupMetadata.subject;

    for (const participant of participants) {
        // Generar el mensaje de bienvenida
        const welcomeMessage = `Hola @${participant.split('@')[0]} bienvenido al grupo *${groupName}*. Lee las reglas para evitar ser expulsado.\n\nEnlace útil: https://whatsapp.com/channel/0029VaGGynJLY6d43krQYR2g`;

        // URL de la imagen a enviar
        const imageURL = 'https://qu.ax/pMjB.jpeg';

        // Descargar la imagen desde el enlace remoto
        const imageBuffer = await fetch(imageURL).then((res) => res.buffer());

        // Enviar la imagen al grupo
        await client.sendMessage(groupId, {
            image: imageBuffer,
            caption: welcomeMessage,
            mentions: [participant], // Mencionar al nuevo miembro
        });
    }
}