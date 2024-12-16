import fetch from 'node-fetch'; // Si no tienes 'node-fetch', instálalo con 'npm install node-fetch'
import fs from 'fs';

// Función para obtener el trabajo aleatorio desde GitHub
const getRandomJob = async () => {
    const url = 'https://raw.githubusercontent.com/Elpapiema/Adiciones-para-AlyaBot-RaphtaliaBot-/refs/heads/main/Random/job.json'; // URL del archivo JSON
    const response = await fetch(url);
    const data = await response.json();
    const jobs = data.jobs;
    return jobs[Math.floor(Math.random() * jobs.length)];
};

// Función para obtener el nombre de la moneda desde 'personalize.json'
const getCurrencyName = () => {
    const config = JSON.parse(fs.readFileSync('./personalize.json'));
    return config.default.currency || 'Yenes'; // Si no hay moneda personalizada, usa 'Yenes'
};

// Guardar el dinero ganado en 'database.json'
const saveEarnings = (userId, moneyEarned) => {
    const database = fs.existsSync('./database.json') ? JSON.parse(fs.readFileSync('./database.json')) : {};
    if (!database[userId]) {
        database[userId] = { money: 0 };
    }
    database[userId].money += moneyEarned;
    fs.writeFileSync('./database.json', JSON.stringify(database, null, 2));
};

// Comando para trabajar
const handler = async (m, { conn, command }) => {
    try {
        const userId = m.sender;
        const job = await getRandomJob(); // Obtener un trabajo aleatorio
        const moneyEarned = Math.floor(Math.random() * (job.maxMoney - job.minMoney + 1)) + job.minMoney; // Calcular el dinero ganado
        const currency = getCurrencyName(); // Obtener el nombre de la moneda (personalizado o predeterminado)

        // Guardar el dinero ganado en 'database.json'
        saveEarnings(userId, moneyEarned);

        // Responder con el mensaje de trabajo realizado
        const message = `Trabajaste arduamente y obtuviste ${moneyEarned} ${currency}. Descripción del trabajo: ${job.description}`;
        await conn.reply(m.chat, message, m);
    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, '❌ Hubo un error al procesar tu trabajo.', m);
    }
};

handler.command = /^(w|work)$/i;

export default handler;
