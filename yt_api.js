import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración de rutas y directorios
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const DOWNLOAD_FOLDER = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOAD_FOLDER)) fs.mkdirSync(DOWNLOAD_FOLDER);

// Servir archivos descargados
app.get('/downloads/:filename', (req, res) => {
    const filePath = path.join(DOWNLOAD_FOLDER, req.params.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Archivo no encontrado' });

    res.download(filePath);
});

// Descargar audio
app.get('/download_audio', (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: 'Falta el parámetro URL' });

    const outputTemplate = path.join(DOWNLOAD_FOLDER, '%(title)s.%(ext)s');
    const command = `yt-dlp -f bestaudio --extract-audio --audio-format mp3 -o "${outputTemplate}" "${url}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) return res.status(500).json({ error: stderr });

        const files = fs.readdirSync(DOWNLOAD_FOLDER).sort((a, b) => fs.statSync(path.join(DOWNLOAD_FOLDER, b)).mtime - fs.statSync(path.join(DOWNLOAD_FOLDER, a)).mtime);
        const filename = files[0];
        const fileUrl = `${req.protocol}://${req.get('host')}/downloads/${filename}`;

        res.json({ message: 'Descarga de audio completada', file_url: fileUrl });
    });
});

// Descargar video
app.get('/download_video', (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: 'Falta el parámetro URL' });

    const outputTemplate = path.join(DOWNLOAD_FOLDER, '%(title)s.%(ext)s');
    const command = `yt-dlp -f 'best[height<=360]' -o "${outputTemplate}" "${url}" --print-json`;

    exec(command, (error, stdout, stderr) => {
        if (error) return res.status(500).json({ error: stderr });

        const videoInfo = JSON.parse(stdout);
        const files = fs.readdirSync(DOWNLOAD_FOLDER).sort((a, b) => fs.statSync(path.join(DOWNLOAD_FOLDER, b)).mtime - fs.statSync(path.join(DOWNLOAD_FOLDER, a)).mtime);
        const filename = files[0];
        const fileUrl = `${req.protocol}://${req.get('host')}/downloads/${filename}`;

        res.json({
            message: 'Descarga de video completada',
            title: videoInfo.title || 'Desconocido',
            duration: videoInfo.duration || 0,
            quality: '360p',
            views: videoInfo.view_count || 0,
            likes: videoInfo.like_count || 0,
            comments: videoInfo.comment_count || 0,
            file_url: fileUrl
        });
    });
});

// Iniciar el servidor automáticamente
export function startYTAPI() {
    return new Promise((resolve) => {
        app.listen(5000, '0.0.0.0', () => resolve());
    });
}