import fetch from 'node-fetch';

export const name = 'welcome';
export const description = 'Plugin de bienvenida para grupos';
export const type = 'event'; // Indica que es un evento, no un comando

export async function handler(client, message) {
    const { participants, id: groupId } = message;

    // Verificar que sea un evento de adición de participantes
    if (!message.action || message.action !== 'add') return;

    // Obtener información del grupo
    const groupMetadata = await client.groupMetadata(groupId);
    const groupName = groupMetadata.subject;

    // Obtener los números de los nuevos participantes
    const newParticipants = participants || [];

    for (const participant of newParticipants) {
        // Generar el mensaje de bienvenida
        const welcomeMessage = `Hola @${participant.split('@')[0]} bienvenido al grupo *${groupName}*. Lee las reglas para evitar ser expulsado.`;

        // URL de la imagen para la vista previa
        const imageURL = 'https://qu.ax/pMjB.jpeg';

        // URL de redirección al pulsar en la vista previa
        const linkURL = 'https://whatsapp.com/channel/0029VaGGynJLY6d43krQYR2g';

        // Enviar el mensaje con vista previa del link
        await client.sendMessage(groupId, {
            text: welcomeMessage,
            mentions: [participant], // Incluir al participante en la mención
            linkPreview: {
                title: `¡Bienvenido a ${groupName}!`,
                jpegThumbnail: await fetch(imageURL).then((res) => res.buffer()),
                description: 'Haz clic para unirte a nuestro canal.',
                url: linkURL,
            },
        });
    }
}