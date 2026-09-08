const usuarios = new Map();

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
  let user = usuarios.get(id);

  if (!user) {
    user = {
      id,
      nome,
      xp: 0,
      nivel: 0,
      ultimo_chat: null,
    };
    usuarios.set(id, user);
  } else {
    user.nome = nome;
  }

  return user;
}

function addXp(id, nome, quantidade) {
  const user = getUsuario(id, nome);
  const nivelAnterior = user.nivel;

  user.xp += quantidade;
  user.nivel = calcularNivel(user.xp);

  return {
    subiu: user.nivel > nivelAnterior,
    nivel: user.nivel,
    xp: user.xp,
  };
}

function podeGanharXpChat(id, nome) {
  const user = getUsuario(id, nome);

  if (!user.ultimo_chat) return true;

  const diffMinutos =
    (Date.now() - new Date(user.ultimo_chat).getTime()) / 1000 / 60;

  return diffMinutos >= 15;
}

function atualizarUltimoChat(id) {
  const user = usuarios.get(id);
  if (user) {
    user.ultimo_chat = new Date().toISOString();
  }
}

function getRanking(limite = 10) {
  return [...usuarios.values()]
    .sort((a, b) => b.xp - a.xp)
    .slice(0, limite);
}

function resetarXp() {
  const total = usuarios.size;

  for (const user of usuarios.values()) {
    user.xp = 0;
    user.nivel = 0;
    user.ultimo_chat = null;
  }

  return total;
}

module.exports = {
  getUsuario,
  addXp,
  podeGanharXpChat,
  atualizarUltimoChat,
  getRanking,
  calcularNivel,
  xpProximoNivel,
  resetarXp,
  NIVEIS,
};
