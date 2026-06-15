const Database = require('better-sqlite3');
const db = new Database('xeno.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id TEXT PRIMARY KEY,
    nome TEXT,
    xp INTEGER DEFAULT 0,
    nivel INTEGER DEFAULT 0,
    ultimo_chat TEXT DEFAULT NULL
  )
`);

// Tabela de níveis exata
const NIVEIS = [
  { nivel: 0,  xp: 0 },
  { nivel: 1,  xp: 1000 },
  { nivel: 2,  xp: 1300 },
  { nivel: 3,  xp: 1500 },
  { nivel: 4,  xp: 1700 },
  { nivel: 5,  xp: 1750 },
  { nivel: 6,  xp: 1850 },
  { nivel: 7,  xp: 1930 },
  { nivel: 8,  xp: 1985 },
  { nivel: 9,  xp: 2100 },
  { nivel: 10, xp: 2300 },
  { nivel: 11, xp: 2500 },
  { nivel: 12, xp: 2750 },
  { nivel: 13, xp: 2950 },
  { nivel: 14, xp: 5000 },
];

function calcularNivel(xp) {
  let nivelAtual = 0;
  for (const entry of NIVEIS) {
    if (xp >= entry.xp) nivelAtual = entry.nivel;
    else break;
  }
  return nivelAtual;
}

function xpProximoNivel(nivelAtual) {
  const proximo = NIVEIS.find(n => n.nivel === nivelAtual + 1);
  return proximo ? proximo.xp : null;
}

function getUsuario(id, nome) {
  let user = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(id);
  if (!user) {
    db.prepare('INSERT INTO usuarios (id, nome) VALUES (?, ?)').run(id, nome);
    user = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(id);
  }
  return user;
}

function addXp(id, nome, quantidade) {
  getUsuario(id, nome);
  db.prepare('UPDATE usuarios SET xp = xp + ?, nome = ? WHERE id = ?').run(quantidade, nome, id);

  const user = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(id);
  const novoNivel = calcularNivel(user.xp);

  if (novoNivel > user.nivel) {
    db.prepare('UPDATE usuarios SET nivel = ? WHERE id = ?').run(novoNivel, id);
    return { subiu: true, nivel: novoNivel, xp: user.xp };
  }

  return { subiu: false, nivel: user.nivel, xp: user.xp };
}

function podeGanharXpChat(id, nome) {
  const user = getUsuario(id, nome);
  if (!user.ultimo_chat) return true;
  const diffMinutos = (new Date() - new Date(user.ultimo_chat)) / 1000 / 60;
  return diffMinutos >= 15;
}

function atualizarUltimoChat(id) {
  db.prepare('UPDATE usuarios SET ultimo_chat = ? WHERE id = ?').run(new Date().toISOString(), id);
}

function getRanking(limite = 10) {
  return db.prepare('SELECT * FROM usuarios ORDER BY xp DESC LIMIT ?').all(limite);
}

module.exports = { getUsuario, addXp, podeGanharXpChat, atualizarUltimoChat, getRanking, calcularNivel, xpProximoNivel, NIVEIS };
