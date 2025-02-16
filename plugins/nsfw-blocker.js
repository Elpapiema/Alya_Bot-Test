export async function before(m) {
    const chat = global.db.data.chats[m.chat] || {};

    // Verifica si m.plugin está definido antes de acceder a sus propiedades
    if (m.plugin && this.plugins[m.plugin]?.tags?.includes('nsfw')) {
        if (!chat.nsfw) {
            m.reply('⚠️ El contenido NSFW está desactivado en este chat.');
            return !1; // Bloquea la ejecución del plugin
        }
    }
}
