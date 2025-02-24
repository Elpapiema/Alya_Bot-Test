console.log('Iniciando 🚀🚀🚀') 
import { join, dirname } from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts'
import { createInterface } from 'readline'
import yargs from 'yargs'
import { startYTAPI } from './yt_api.mjs' // Importamos el servidor de descargas

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)
const { name, author } = require(join(__dirname, './package.json'))
const { say } = cfonts
const rl = createInterface(process.stdin, process.stdout)

// Cambia por el nombre de tu bot
say('Alya_Bot', {
    font: 'chrome',
    align: 'center',
    gradient: ['red', 'magenta']
})

say(`Con amor por Emma (Violets Version)`, {
    font: 'console',
    align: 'center',
    gradient: ['red', 'magenta']
})

let isRunning = false
/**
 * Start a js file
 * @param {String} file `path/to/file`
 */
function start(file) {
    if (isRunning) return
    isRunning = true
    const args = [join(__dirname, file), ...process.argv.slice(2)]

    setupMaster({
        exec: args[0],
        args: args.slice(1)
    })
    
    const p = fork()
    
    p.on('message', (data) => {
        switch (data) {
            case 'reset':
                p.process.kill()
                isRunning = false
                start.apply(this, arguments)
                break
            case 'uptime':
                p.send(process.uptime())
                break
        }
    })

    p.on('exit', (_, code) => {
        isRunning = false;
        console.error('⚠️ Error Inesperado ⚠️', code)
        p.process.kill()
        isRunning = false
        start.apply(this, arguments)
        if (process.env.pm_id) {
            process.exit(1)
        } else {
            process.exit()
        }
    })
    
    const opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
    
    if (!opts['test']) {
        if (!rl.listenerCount()) {
            rl.on('line', (line) => {
                p.emit('message', line.trim())
            })
        }
    }
}

// Iniciamos el servidor de descargas antes del bot
(async () => {
    try {
        await startYTAPI();
        console.log('✅ Servidor de descargas iniciado en el puerto 5000');
    } catch (error) {
        console.error('❌ Error al iniciar el servidor de descargas:', error);
    } finally {
        start('main.js'); // Luego de iniciar el servidor, arrancamos el bot
    }
})();

/*console.log('Iniciando 🚀🚀🚀') 
import { join, dirname } from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts'
import { createInterface } from 'readline'
import yargs from 'yargs'
const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)
const { name, author } = require(join(__dirname, './package.json'))
const { say } = cfonts
const rl = createInterface(process.stdin, process.stdout)
 
// CAmbia porel Nombre de tu bot
say('Alya_Bot', {
font: 'chrome',
align: 'center',
gradient: ['red', 'magenta']})
say(`Con amor por Emma (Violets Version)`, {
font: 'console',
align: 'center',
gradient: ['red', 'magenta']});

let isRunning = false
/**
* Start a js file
* @param {String} file `path/to/file`
*/
function start(file) {
if (isRunning) return
isRunning = true
const args = [join(__dirname, file), ...process.argv.slice(2)]

setupMaster({
exec: args[0],
args: args.slice(1)})
const p = fork()
p.on('message', (data) => {
//console.log('╭--------- - - - ✓\n┆ ✅ TIEMPO DE ACTIVIDAD ACTUALIZADA\n╰-------------------- - - -', data)
switch (data) {
case 'reset':
p.process.kill()
isRunning = false
start.apply(this, arguments)
break
case 'uptime':
p.send(process.uptime())
break
}
})
p.on('exit', (_, code) => {
isRunning = false;
console.error('⚠️ Error Inesperado ⚠️', code)
p.process.kill()
isRunning = false
start.apply(this, arguments)
if (process.env.pm_id) {
process.exit(1)
} else {
process.exit()
}})
const opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
if (!opts['test']) {
if (!rl.listenerCount()) {
rl.on('line', (line) => {
p.emit('message', line.trim())
})
}}}
start('main.js')*/
