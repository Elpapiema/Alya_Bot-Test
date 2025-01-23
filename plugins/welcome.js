let handler = async (m, { conn, participants, isAdmin }) => {
    const chat = global.db.data.chats[m.chat];
    if (!chat.welcome) return; // Si las bienvenidas están desactivadas, no hacer nada

    // Filtrar nuevos participantes
    const newParticipants = participants.filter(p => p.action === 'add').map(p => p.id);
    if (!newParticipants.length) return;

    for (const user of newParticipants) {
        const userName = await conn.getName(user);
        const groupName = await conn.getName(m.chat);

        // Mensaje de bienvenida personalizado
        const welcomeMessage = `👋 ¡Bienvenido(a), @${user.split('@')[0]}!
        
        💬 Estamos encantados de tenerte en *${groupName}*. Lee las reglas del grupo y disfruta tu estancia.

        📌 Recuerda: Si necesitas ayuda, no dudes en pedirla.`;

        // Enviar mensaje de bienvenida
        await conn.sendMessage(m.chat, {
            text: welcomeMessage,
            mentions: [user]
        });
    }
};

handler.groupParticipantsUpdate = true; // Escucha eventos de participantes en grupos
export default handler;