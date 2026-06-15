const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUsuario, calcularNivel, xpProximoNivel } = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('xp')
    .setDescription('Veja seu XP e nível atual'),

  async execute(interaction) {
    const { id, username } = interaction.user;
    const user = getUsuario(id, username);

    const nivelAtual = calcularNivel(user.xp);
    const xpProximo = xpProximoNivel(nivelAtual);

    let barraTexto = '';
    if (xpProximo !== null) {
      const filled = Math.round((user.xp / xpProximo) * 10);
      barraTexto = '▓'.repeat(Math.min(filled, 10)) + '░'.repeat(Math.max(10 - filled, 0));
      barraTexto += ` ${user.xp}/${xpProximo} XP`;
    } else {
      barraTexto = '▓'.repeat(10) + ' Nível máximo!';
    }

    const embed = new EmbedBuilder()
      .setColor(0x7F77DD)
      .setTitle(`⭐ XP de ${username}`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .addFields(
        { name: '🏅 Nível', value: `**${nivelAtual}**`, inline: true },
        { name: '✨ XP Total', value: `**${user.xp} XP**`, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: xpProximo ? `Progresso para o Nível ${nivelAtual + 1}` : 'Progresso', value: barraTexto },
      )
      .setFooter({ text: 'Xeno Bot • Sistema de XP' });

    await interaction.reply({ embeds: [embed] });
  },
};
