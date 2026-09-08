const { REST, Routes } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,

  async execute(client) {
    console.log(`✅ Xeno Bot online como ${client.user.tag}`);
    console.log(`🌐 Conectado a ${client.guilds.cache.size} servidor(es).`);

    try {
      const fs = require('fs');
      const path = require('path');

      const commands = [];
      const commandsPath = path.join(__dirname, '../commands');

      if (!fs.existsSync(commandsPath)) {
        console.error(`❌ Pasta de comandos não encontrada: ${commandsPath}`);
        return;
      }

      const files = fs
        .readdirSync(commandsPath)
        .filter(file => file.endsWith('.js'));

      for (const file of files) {
        try {
          const commandPath = path.join(commandsPath, file);
          const command = require(commandPath);

          if (!command.data || !command.execute) {
            console.warn(`⚠️ Comando ignorado: ${file}`);
            continue;
          }

          commands.push(command.data.toJSON());

          console.log(`📦 Comando carregado: ${command.data.name}`);
        } catch (error) {
          console.error(`❌ Erro ao carregar ${file}:`, error);
        }
      }

      if (!process.env.TOKEN) {
        console.error('❌ TOKEN não configurado.');
        return;
      }

      if (!process.env.CLIENT_ID) {
        console.error('❌ CLIENT_ID não configurado.');
        return;
      }

      if (!process.env.GUILD_ID) {
        console.error('❌ GUILD_ID não configurado.');
        return;
      }

      const rest = new REST({ version: '10' })
        .setToken(process.env.TOKEN);

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
      console.log('🚀 Bot pronto para receber comandos!');
    } catch (error) {
      console.error('❌ Erro durante a inicialização:');
      console.error(error);
    }
  }
};
