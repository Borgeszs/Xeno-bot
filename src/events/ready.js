const { REST, Routes, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const CANAL_MEME_ID = '1491100233696809152';
const INTERVALO_MS = 30 * 60 * 1000;

module.exports = {
name: 'ready',
once: true,

async execute(client) {
console.log(`✅ Xeno Bot online como ${client.user.tag}`);
console.log(`🌐 Conectado a ${client.guilds.cache.size} servidor(es).`);

```
// ============================================================
// REGISTRO DOS SLASH COMMANDS
// ============================================================

try {
  const commands = [];
  const commandsPath = path.join(__dirname, '../commands');

  if (!fs.existsSync(commandsPath)) {
    console.error('❌ Pasta de comandos não encontrada:', commandsPath);
    return;
  }

  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    try {
      const commandPath = path.join(commandsPath, file);
      const command = require(commandPath);

      if (!command.data || !command.execute) {
        console.warn(`⚠️ Comando ignorado: ${file}`);
        console.warn('   O arquivo precisa possuir "data" e "execute".');
        continue;
      }

      commands.push(command.data.toJSON());
    } catch (error) {
      console.error(`❌ Erro ao carregar o comando ${file}:`, error);
    }
  }

  if (!process.env.TOKEN) {
    console.error('❌ A variável TOKEN não está configurada.');
    return;
  }

  if (!process.env.CLIENT_ID) {
    console.error('❌ A variável CLIENT_ID não está configurada.');
    return;
  }

  if (!process.env.GUILD_ID) {
    console.error('❌ A variável GUILD_ID não está configurada.');
    return;
  }

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    {
      body: commands
    }
  );

  console.log(`📋 ${commands.length} comando(s) registrado(s) com sucesso.`);
} catch (error) {
  console.error('❌ Erro ao registrar os slash commands:');
  console.error(error);
}

// ============================================================
// SISTEMA DE MEMES
// ============================================================

const memesPath = path.join(__dirname, '../utils/memes.js');

if (!fs.existsSync(memesPath)) {
  console.warn('⚠️ Sistema de memes desativado.');
  console.warn('   Arquivo não encontrado:', memesPath);
  return;
}

let getMemeAleatorio;

try {
  ({ getMemeAleatorio } = require(memesPath));
} catch (error) {
  console.error('❌ Não foi possível carregar o sistema de memes:');
  console.error(error);
  return;
}

async function enviarMeme() {
  try {
    const canal = await client.channels.fetch(CANAL_MEME_ID);

    if (!canal) {
      console.warn('⚠️ Canal de memes não encontrado.');
      return;
    }

    const meme = getMemeAleatorio();

    if (!meme) {
      console.warn('⚠️ Nenhum meme disponível.');
      return;
    }

    if (meme.type === 'gif') {
      const embed = new EmbedBuilder()
        .setColor(0xF5A623)
        .setImage(meme.url);

      if (meme.legenda) {
        embed.setDescription(meme.legenda);
      }

      await canal.send({
        embeds: [embed]
      });
    } else {
      await canal.send(meme.conteudo);
    }

    console.log(
      `😂 [Meme] Enviado às ${new Date().toLocaleTimeString('pt-BR')}`
    );
  } catch (error) {
    console.error('❌ [Meme] Erro ao enviar meme:', error);
  }
}

// Envia um meme ao iniciar
await enviarMeme();

// Depois envia um meme a cada 30 minutos
setInterval(enviarMeme, INTERVALO_MS);

console.log('😂 Sistema de memes iniciado.');
console.log('⏰ Intervalo: 30 minutos.');
```

}
};
