const { REST, Routes, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { getMemeAleatorio } = require('../utils/memes');

const CANAL_MEME_ID = '1491100233696809152';
const INTERVALO_MS = 30 * 60 * 1000;

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`✅ Xeno Bot online como ${client.user.tag}`);

    // Registra slash commands
    const commands = [];
    const commandsPath = path.join(__dirname, '../commands');
    for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
      const cmd = require(path.join(commandsPath, file));
      commands.push(cmd.data.toJSON());
    }

    const rest = new REST().setToken(process.env.TOKEN);
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log(`📋 ${commands.length} comandos registrados.`);

    // ── Meme scheduler ────────────────────────────────────────────────────
    async function enviarMeme() {
      try {
        const canal = await client.channels.fetch(CANAL_MEME_ID);
        if (!canal) return;

        const meme = getMemeAleatorio();

        if (meme.type === 'gif') {
          const embed = new EmbedBuilder()
            .setColor(0xF5A623)
            .setImage(meme.url);
          if (meme.legenda) embed.setDescription(meme.legenda);
          await canal.send({ embeds: [embed] });
        } else {
          await canal.send(meme.conteudo);
        }

        console.log('[Meme] Enviado às', new Date().toLocaleTimeString('pt-BR'));
      } catch (err) {
        console.error('[Meme] Erro:', err.message);
      }
    }

    await enviarMeme();
    setInterval(enviarMeme, INTERVALO_MS);
  },
};
