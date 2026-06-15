const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { addXp } = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set')
    .setDescription('(Admin) Dá XP para uma pessoa específica')
    .addUserOption(opt =>
      opt.setName('usuario')
        .setDescription('Marque o @ do usuário')
        .setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('xp')
        .setDescription('Quantidade de XP a dar')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(9999)
    )
    .addStringOption(opt =>
      opt.setName('motivo')
        .setDescription('Motivo (ex: participou do evento X)')
        .setRequired(false)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '❌ Apenas admins podem usar este comando.', ephemeral: true });
    }

    const alvo = interaction.options.getUser('usuario');
    const xp = interaction.options.getInteger('xp');
    const motivo = interaction.options.getString('motivo') ?? 'Evento';

    if (alvo.bot) {
      return interaction.reply({ content: '❌ Não dá pra dar XP para um bot.', ephemeral: true });
    }

    const resultado = addXp(alvo.id, alvo.username, xp);

    const embed = new EmbedBuilder()
      .setColor(0x1D9E75)
      .setTitle('✅ XP Adicionado!')
      .setThumbnail(alvo.displayAvatarURL())
      .addFields(
        { name: '👤 Usuário', value: `<@${alvo.id}>`, inline: true },
        { name: '✨ XP dado', value: `+${xp} XP`, inline: true },
        { name: '📋 Motivo', value: motivo, inline: true },
        { name: '📊 XP Total', value: `${resultado.xp} XP`, inline: true },
        { name: '🏅 Nível atual', value: `${resultado.nivel}`, inline: true },
      )
      .setFooter({ text: `Dado por ${interaction.user.username}` });

    await interaction.reply({ embeds: [embed] });

    if (resultado.subiu) {
      await interaction.followUp(`🎉 <@${alvo.id}> subiu para o **Nível ${resultado.nivel}**!`);
    }
  },
};
