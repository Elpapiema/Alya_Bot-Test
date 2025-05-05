import fs from 'fs';
import path from 'path';

const ecoPath = './eco_config.json';
const dbPath = './db_users.json';

const emojiMap = {
  piedra: '🪨',
  papel: '📄',
  tijera: '✂️'
};

let handler = async (m, { conn, args }) => {
  if (!m.isGroup) return m.reply('Este comando solo puede usarse en grupos.');
  const mentioned = m.mentionedJid?.[0];
  if (!mentioned) return m.reply('Menciona a un usuario para jugar piedra, papel o tijeras.');

  const gameId = `${m.chat}-${mentioned}`;
  global.pptGames = global.pptGames || {};
  if (global.pptGames[gameId]) return m.reply('Ya hay un juego en curso con este usuario.');

  if (!fs.existsSync(ecoPath)) {
    fs.writeFileSync(ecoPath, JSON.stringify({
      ppt: { reward: 100, penalty: 50 }
    }, null, 2));
  }

  const ecoConfig = JSON.parse(fs.readFileSync(ecoPath));
  const reward = ecoConfig.ppt.reward;
  const penalty = ecoConfig.ppt.penalty;

  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));
  const db = JSON.parse(fs.readFileSync(dbPath));

  global.pptGames[gameId] = {
    player1: m.sender,
    player2: mentioned,
    group: m.chat,
    status: 'waiting',
    choices: {},
    reward,
    penalty
  };

  await conn.sendMessage(m.sender, { text: 'Responde con piedra 🪨, papel 📄 o tijera ✂️.' });
  await conn.sendMessage(mentioned, { text: 'Te han retado a PPT. Responde con piedra 🪨, papel 📄 o tijera ✂️.' });

  setTimeout(() => {
    if (global.pptGames[gameId]?.status === 'waiting') {
      delete global.pptGames[gameId];
      conn.sendMessage(m.chat, { text: '⏱️ Juego cancelado por inactividad.' });
    }
  }, 2 * 60 * 1000);
};

handler.before = async (m) => {
  if (!m.isGroup || !global.pptGames) return;
  const gameId = Object.keys(global.pptGames).find(id => {
    const g = global.pptGames[id];
    return g.status === 'waiting' && (m.sender === g.player1 || m.sender === g.player2);
  });

  if (!gameId) return;

  const game = global.pptGames[gameId];
  const choice = m.text.toLowerCase();
  if (!['piedra', 'papel', 'tijera'].includes(choice)) return;

  game.choices[m.sender] = choice;

  if (Object.keys(game.choices).length < 2) return;

  game.status = 'done';
  const { player1, player2, group, reward, penalty } = game;
  const c1 = game.choices[player1];
  const c2 = game.choices[player2];

  let result;
  if (c1 === c2) result = '🤝 ¡Empate!';
  else if (
    (c1 === 'piedra' && c2 === 'tijera') ||
    (c1 === 'papel' && c2 === 'piedra') ||
    (c1 === 'tijera' && c2 === 'papel')
  ) {
    result = `🎉 ¡${(await conn.getName(player1))} gana! +${reward}`;
    db[player1] = db[player1] || { money: 0, bank: 0 };
    db[player1].money += reward;
    db[player2] = db[player2] || { money: 0, bank: 0 };
    db[player2].money = Math.max(0, db[player2].money - penalty);
  } else {
    result = `🎉 ¡${(await conn.getName(player2))} gana! +${reward}`;
    db[player2] = db[player2] || { money: 0, bank: 0 };
    db[player2].money += reward;
    db[player1] = db[player1] || { money: 0, bank: 0 };
    db[player1].money = Math.max(0, db[player1].money - penalty);
  }

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  await conn.sendMessage(group, {
    text: `🎮 *Resultados del juego:*\n\n👤 ${(await conn.getName(player1))}: ${emojiMap[c1]} (${c1})\n👤 ${(await conn.getName(player2))}: ${emojiMap[c2]} (${c2})\n\n${result}`,
    mentions: [player1, player2]
  });

  delete global.pptGames[gameId];
};

handler.command = /^ppt$/i;
handler.tags = ['game'];
handler.help = ['ppt @usuario'];
handler.group = true;

export default handler;


/*import fs from 'fs';
import path from 'path';

const ecoPath = './eco_config.json';
const dbPath = './db_users.json';

let handler = async (m, { conn, args }) => {
  if (!m.isGroup) return m.reply('Este comando solo puede usarse en grupos.');
  const mentioned = m.mentionedJid?.[0];
  if (!mentioned) return m.reply('Menciona a un usuario para jugar piedra, papel o tijeras.');

  const gameId = `${m.chat}-${mentioned}`;
  global.pptGames = global.pptGames || {};

  if (global.pptGames[gameId]) return m.reply('Ya hay un juego en curso con este usuario.');

  if (!fs.existsSync(ecoPath)) {
    fs.writeFileSync(ecoPath, JSON.stringify({
      ppt: { reward: 100, penalty: 50 }
    }, null, 2));
  }

  const ecoConfig = JSON.parse(fs.readFileSync(ecoPath));
  const reward = ecoConfig.ppt.reward;
  const penalty = ecoConfig.ppt.penalty;

  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));
  const db = JSON.parse(fs.readFileSync(dbPath));

  global.pptGames[gameId] = {
    player1: m.sender,
    player2: mentioned,
    group: m.chat,
    status: 'waiting',
    choices: {},
    reward,
    penalty
  };

  await conn.sendMessage(m.sender, { text: 'Responde con piedra, papel o tijera.' });
  await conn.sendMessage(mentioned, { text: 'Te han retado a PPT. Responde con piedra, papel o tijera.' });

  setTimeout(() => {
    if (global.pptGames[gameId]?.status === 'waiting') {
      delete global.pptGames[gameId];
      conn.sendMessage(m.chat, { text: 'Juego cancelado por inactividad.' });
    }
  }, 2 * 60 * 1000);
};

handler.before = async (m) => {
  if (!m.isGroup || !global.pptGames) return;
  const gameId = Object.keys(global.pptGames).find(id => {
    const g = global.pptGames[id];
    return g.status === 'waiting' && (m.sender === g.player1 || m.sender === g.player2);
  });

  if (!gameId) return;

  const game = global.pptGames[gameId];
  const choice = m.text.toLowerCase();
  if (!['piedra', 'papel', 'tijera'].includes(choice)) return;

  game.choices[m.sender] = choice;

  if (Object.keys(game.choices).length < 2) return;

  game.status = 'done';
  const { player1, player2, group, reward, penalty } = game;
  const c1 = game.choices[player1];
  const c2 = game.choices[player2];

  let result;
  if (c1 === c2) result = 'Empate!';
  else if (
    (c1 === 'piedra' && c2 === 'tijera') ||
    (c1 === 'papel' && c2 === 'piedra') ||
    (c1 === 'tijera' && c2 === 'papel')
  ) {
    result = `¡${(await conn.getName(player1))} gana! +${reward}`;
    db[player1] = db[player1] || { money: 0, bank: 0 };
    db[player1].money += reward;
    db[player2] = db[player2] || { money: 0, bank: 0 };
    db[player2].money = Math.max(0, db[player2].money - penalty);
  } else {
    result = `¡${(await conn.getName(player2))} gana! +${reward}`;
    db[player2] = db[player2] || { money: 0, bank: 0 };
    db[player2].money += reward;
    db[player1] = db[player1] || { money: 0, bank: 0 };
    db[player1].money = Math.max(0, db[player1].money - penalty);
  }

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  await conn.sendMessage(group, {
    text: `Resultados del juego:\n\n${(await conn.getName(player1))}: ${c1}\n${(await conn.getName(player2))}: ${c2}\n\n${result}`,
    mentions: [player1, player2]
  });

  delete global.pptGames[gameId];
};

handler.command = /^ppt$/i;
handler.tags = ['game'];
handler.help = ['ppt @usuario'];
handler.group = true;

export default handler; */