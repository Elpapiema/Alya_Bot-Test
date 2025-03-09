import express from 'express';
import cors from 'cors';
import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors()); // Habilitar CORS

// Carpeta de descargas
const DOWNLOAD_FOLDER = path.join(__dirname, 'tmp');
if (!fs.existsSync(DOWNLOAD_FOLDER)) {
    fs.mkdirSync(DOWNLOAD_FOLDER);
}

// Ruta para servir archivos descargados
app.get('/tmp/:filename', (req, res) => {
    const filePath = path.join(DOWNLOAD_FOLDER, req.params.filename);

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    // Enviar el archivo como descarga
    res.download(filePath);
});

// Ruta para descargar audio
app.get('/download_audio', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'Falta el parámetro URL' });
    }

    try {
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\w\-_.]/g, '_'); // Limpiar el título
        const outputFilePath = path.join(DOWNLOAD_FOLDER, `${title}.mp3`);

        // Descargar y convertir a MP3
        const audioStream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' })
            .pipe(fs.createWriteStream(outputFilePath));

        audioStream.on('finish', () => {
            const fileUrl = `${req.protocol}://${req.get('host')}/tmp/${title}.mp3`;
            res.json({ message: 'Descarga de audio completada', file_url: fileUrl });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para descargar video
app.get('/download_video', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'Falta el parámetro URL' });
    }

    try {
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\w\-_.]/g, '_'); // Limpiar el título
        const outputFilePath = path.join(DOWNLOAD_FOLDER, `${title}.mp4`);

        // Descargar video en calidad 360p
        const videoStream = ytdl(url, { quality: 'lowestvideo' })
            .pipe(fs.createWriteStream(outputFilePath));

        videoStream.on('finish', () => {
            const fileUrl = `${req.protocol}://${req.get('host')}/tmp/${title}.mp4`;
            res.json({
                message: 'Descarga de video completada',
                title: info.videoDetails.title,
                duration: info.videoDetails.lengthSeconds,
                quality: '360p',
                views: info.videoDetails.viewCount,
                likes: info.videoDetails.likes,
                comments: info.videoDetails.commentCount,
                file_url: fileUrl
            });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar el servidor
const PORT = 5194;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});