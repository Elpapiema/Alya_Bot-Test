import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db_users.json');
const personalizePath = path.join(process.cwd(), 'personalize.json');

// Función para leer archivos JSON
function readJSON(filePath) {
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Obtener la moneda configurada en personalize.json
function getCurrency() {
    let personalizeData = readJSON(personalizePath);
    return personalizeData.global?.currency || personalizeData.default?.currency || 'monedas'; // Usa "monedas" si no hay valores definidos
}

let handler = async (m, { text, sender }) => {
    let userId = sender; // ID del usuario que ejecuta el comando
    let db = readJSON(dbPath);
    let currency = getCurrency(); // Obtener la moneda personalizada

    // Asegurar que el usuario tenga un balance en su cuenta
    if (!db[userId]) db[userId] = { money: 0, bank: 0 };

    let userMoney = db[userId].money;
    let userBank = db[userId].bank;

    // Manejo del comando sin argumento
    if (!text) {
        m.reply(`❌ Uso incorrecto. Usa:\n- \`.deposit cantidad\`\n- \`.deposit all\``);
        return;
    }

    let depositAmount;

    if (text.toLowerCase() === 'all') {
        depositAmount = userMoney; // Depositar todo
    } else {
        depositAmount = parseInt(text);
        if (isNaN(depositAmount) || depositAmount <= 0) {
            m.reply(`❌ Ingresa una cantidad válida.`);
            return;
        }
    }

    // Validar que el usuario tenga suficiente dinero para depositar
    if (depositAmount > userMoney) {
        m.reply(`❌ No tienes suficiente ${currency} para depositar esa cantidad.`);
        return;
    }

    // Realizar el depósito
    db[userId].money -= depositAmount;
    db[userId].bank += depositAmount;
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    m.reply(`✅ Has depositado ${depositAmount} ${currency} en el banco.\n\n💰 **${currency} restante:** ${db[userId].money}\n🏦 **Saldo en el banco:** ${db[userId].bank}`);
};

// Definir el comando
handler.command = /^(deposit)$/i;

export default handler;