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