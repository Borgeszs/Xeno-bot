# 🤖 Xeno Bot — Sistema de XP + Memes Dragon Ball

## ✨ Fontes de XP

| Ação | XP |
|---|---|
| Mandar mensagem (cooldown 15 min) | +10 XP |
| Participar de evento `/set` (admin define) | +? XP |

## 📋 Comandos

| Comando | Descrição |
|---|---|
| `/xp` | Vê seu nível e XP atual |
| `/ranking` | Top 10 do servidor |
| `/set <xp>` | (Admin) Distribui XP de evento |

## 🐉 Memes automáticos

O bot envia um meme aleatório de Dragon Ball a cada **30 minutos** no canal configurado.
- 2 GIFs personalizados
- 13 textos engraçados em PT-BR
- Para adicionar mais, edite `src/utils/memes.js`

## 🚀 Como rodar

### 1. Clonar e instalar
```bash
git clone <seu-repo>
cd xeno-bot
npm install
```

### 2. Configurar o .env
```bash
cp .env.example .env
```
Preencha com:
- `TOKEN` — token do bot (Discord Developer Portal)
- `CLIENT_ID` — ID da aplicação
- `GUILD_ID` — ID do seu servidor

### 3. Rodar
```bash
npm start
```

## 🌐 Host gratuita — Railway

1. Acesse [railway.app](https://railway.app) e logue com GitHub
2. **New Project → Deploy from GitHub repo** → selecione o repo
3. Vá em **Variables** e adicione as 3 variáveis do `.env`
4. Pronto! Sobe automaticamente a cada push 🚀

> Railway dá $5/mês de crédito gratuito — suficiente pra rodar 24/7.

## 📁 Estrutura
```
xeno-bot/
├── src/
│   ├── index.js
│   ├── commands/
│   │   ├── xp.js
│   │   ├── ranking.js
│   │   └── set.js
│   ├── events/
│   │   ├── ready.js          ← registro de comandos + meme scheduler
│   │   ├── messageCreate.js  ← XP por mensagem
│   │   └── interactionCreate.js
│   └── utils/
│       ├── database.js       ← SQLite
│       └── memes.js          ← lista de memes/gifs
├── .env.example
├── .gitignore
└── package.json
```
