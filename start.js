import { exec } from 'child_process';

console.log('Instalando yt-dlp...');
exec('pip3 install yt-dlp', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error al instalar yt-dlp: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Advertencias: ${stderr}`);
    }
    console.log(`Salida: ${stdout}`);
    console.log('yt-dlp instalado correctamente.');

    console.log('Iniciando bot de WhatsApp...');
    exec('node index.js', (err, out, errOut) => {
        if (err) {
            console.error(`Error al iniciar el bot: ${err.message}`);
            return;
        }
        if (errOut) {
            console.error(`Advertencias: ${errOut}`);
        }
        console.log(`Salida del bot: ${out}`);
    });
});