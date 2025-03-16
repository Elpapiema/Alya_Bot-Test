import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import*as cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

//---------[ Añada los numeros a ser Propietario/a ]---------

global.owner = [['5212441357601', 'ＰＲＯＰＩＥＴＡＲＩＯ', true]]
global.mods = []
global.prems = []

//BETA: Si quiere evitar escribir el número que será bot en la consola, agregué desde aquí entonces:
global.botNumberCode = "" //Ejemplo: +59309090909
global.confirmCode = "" 
global.gataJadibts = true //cambia a false Desactivar en "auto-reconexion" de sub-bots

//---------[ APIS GLOBAL ]---------

global.baileys = '@whiskeysockets/baileys'
global.apis = 'https://delirius-apiofc.vercel.app'

global.APIs = { lolhuman: { url: 'https://api.lolhuman.xyz/api/', key: 'GataDiosV3' },
skizo: { url: 'https://skizo.tech/api/', key: 'GataDios' },
alyachan: { url: 'https://api.alyachan.dev/api/', key: null }, 
neoxr: { url: 'https://api.neoxr.eu/api', key: 'GataDios' },
fgmods: { url: 'https://api.fgmods.xyz/api', key: 'elrebelde21' },
popcat: { url: 'https://api.popcat.xyz', key: null }}

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment	

//------------------------[ Stickers ]-----------------------------

global.packname = 'AlyaBot'
global.author = 'Emma (Violets Version)'

//------------[ Versión | Nombre | cuentas ]------------

global.wm = 'AlyaBot' 
global.vs = '1.0.0'
global.dev = 'Emma (Violets Version)'
global.copy = '©️ 2025'
//----------------------------[ NIVELES | RPG ]---------------------------------

global.multiplier = 850 // Cuanto más alto, más difícil subir de nivel
global.maxwarn = '4' // máxima advertencias

//━━━━━━━━━━━━━━━━━━━━ ฅ^•ﻌ•^ฅ

global.rwait = '⌛'
global.dmoji = '🤭'
global.done = '✅'
global.error = '❌' 
global.xmoji = '🔥'
//---------------[ IDs de canales ]----------------
// usa esta configuracion si vas a usar el rcanal

/*global.ch = {
ch1: '120363297379773397@newsletter', 
ch2: '120363355261011910@newsletter', 
ch3: '120363160031023229@newsletter',
ch4: '120363301598733462@newsletter',
ch5: '120363374372683775@newsletter', 
ch6: '120363378052785679@newsletter',
}*/

//----------------------------------------------------

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
