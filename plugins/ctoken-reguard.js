const generateToken = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < 8; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
};

const handler = async (m, { args }) => {
    // Verificar que solo los owners puedan usar este comando
    if (!global.owner.includes(m.sender)) {
        return m.reply('⚠️ Este comando es solo para los propietarios del bot.');
    }

    // Verificar que el comando tenga los parámetros necesarios (valor y máximo de usos)
    if (args.length < 2) {
        return m.reply('⚠️ Debes proporcionar el valor y el número máximo de usos.\nEjemplo: *.ctoken ABCD1234 50*');
    }

    const value = args[0].toUpperCase();
    const maxUses = parseInt(args[1]);

    // Validar el número máximo de usos
    if (isNaN(maxUses)) {
        return m.reply('⚠️ El número máximo de usos debe ser un valor numérico.');
    }

    const token = generateToken();  // Generar el token
    const creationDate = new Date().toISOString();  // Obtener la fecha de creación

    // Enviar el token y la información al chat
    return m.reply(`✅ Token generado: *${token}*\n🔹 Valor: ${value}\n🔸 Máximo de usos: ${maxUses}\n📅 Fecha de creación: ${creationDate}`);
};

handler.command = ['ctoken'];  // Definir el comando
handler.rowner = true;  // Solo para los propietarios

export default handler;