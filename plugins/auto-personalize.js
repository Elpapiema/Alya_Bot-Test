import fs from 'fs';

const filePath = './personalize.json';
const defaultData = {
    default: {
        botName: "Alya Mikhailovna Kujou",
        currency: "yen",
        videos: [
            'https://qu.ax/WgJR.mp4',
            'https://qu.ax/kOwY.mp4',
            'https://qu.ax/UYGf.mp4'
        ]
    },
    owners: {},
    users: {}
};

// Inicialización automática
const initPersonalizeFile = () => {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
            console.log('✅ Archivo `personalize.json` creado con datos predeterminados.');
        } else {
            console.log('✅ Archivo `personalize.json` ya existe. No se realizaron cambios.');
        }
    } catch (error) {
        console.error('❌ Error al inicializar el archivo `personalize.json`:', error.message);
    }
};

// Llamar la función al cargar el plugin
initPersonalizeFile();

export default {}; // No se necesita exportar comandos