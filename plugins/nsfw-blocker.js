export async function before(m) {
    const chat = global.db.data.chats[m.chat] || {};
    
    // Verifica si el mensaje corresponde a un plugin NSFW
    if (this.plugins[m.plugin]?.tags?.includes('nsfw')) {
        if (!chat.nsfw) {
            m.reply('⚠️ El contenido NSFW está desactivado en este chat.');
            return !1; // Bloquea la ejecución del plugin
        }
    }
}
