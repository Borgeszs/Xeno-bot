const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getRanking } = require('../utils/database');

const medalhas = ['🥇', '🥈', '🥉'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ranking')
    .setDescription('Veja o top 10 do servidor'),

  async execute(interaction) {
    const top = getRanking(10);

    if (!top.length) {
      return interaction.reply({ content: 'Ainda não há ninguém no ranking!', ephemeral: true });
    }

    const lista = top.map((u, i) => {
      const icone = medalhas[i] ?? `**${i + 1}.**`;
      return `${icone} <@${u.id}> — **${u.xp} XP** (Nível ${u.nivel})`;
    }).join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x7F77DD)
      .setTitle('🏆 Ranking do Servidor')
      .setDescription(lista)
      .setFooter({ text: 'Xeno Bot • Sistema de XP' });

    await interaction.reply({ embeds: [embed] });
  },
};
