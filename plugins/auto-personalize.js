import fs from 'fs';

const filePath = './personalize.json';

const defaultData = {
    default: {
        botName: "Alya Mikhailovna Kujou",
        currency: "Yenes",
        videos: [
            "https://files.catbox.moe/b5n81s.mp4",
            "https://files.catbox.moe/o9vzpe.mp4",
            "https://files.catbox.moe/4qg0nz.mp4"
        ]
    },
    owners: {},
    users: {}
};

const createPreferences = () => {
    try {
        if (!fs.existsSync(filePath)) {
            // Crear archivo con datos predeterminados si no existe
            fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
            console.log("[INFO] Archivo personalize.json creado con datos predeterminados.");
        } else {
            // Validar y corregir la estructura del archivo existente
            const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            // Validar las claves principales
            if (!existingData.default || typeof existingData.default !== "object") {
                existingData.default = defaultData.default;
            }
            if (!existingData.owners || typeof existingData.owners !== "object") {
                existingData.owners = {};
            }
            if (!existingData.users || typeof existingData.users !== "object") {
                existingData.users = {};
            }

            // Escribir los cambios, si es necesario
            fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
            console.log("[INFO] Archivo personalize.json validado y actualizado.");
        }
    } catch (error) {
        console.error(`[ERROR] Ocurrió un problema al gestionar personalize.json: ${error.message}`);
    }
};

// Ejecutar automáticamente al inicio
createPreferences();

export default createPreferences;