const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Database = require('better-sqlite3');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resetxp')
    .setDescription('(Admin) Zera o XP de todos os membros do servidor'),

  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '❌ Apenas admins podem usar este comando.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(0xFF3333)
      .setTitle('⚠️ Confirmar Reset Global de XP')
      .setDescription('Isso vai **zerar o XP e o nível de todos** os membros do servidor.\n\nEssa ação **não pode ser desfeita**. Tem certeza?')
      .setFooter({ text: 'Você tem 30 segundos para confirmar.' });

    const botoes = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('resetxp_confirmar')
        .setLabel('✅ Sim, resetar tudo')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('resetxp_cancelar')
        .setLabel('❌ Cancelar')
        .setStyle(ButtonStyle.Secondary),
    );

    await interaction.reply({ embeds: [embed], components: [botoes], ephemeral: true });

    const collector = interaction.channel.createMessageComponentCollector({
      filter: i => i.user.id === interaction.user.id && ['resetxp_confirmar', 'resetxp_cancelar'].includes(i.customId),
      time: 30_000,
      max: 1,
    });

    collector.on('collect', async i => {
      if (i.customId === 'resetxp_cancelar') {
        return i.update({
          embeds: [new EmbedBuilder().setColor(0x888888).setDescription('❌ Reset cancelado.')],
          components: [],
        });
      }

      // Reseta tudo
      const db = new Database('xeno.db');
      db.prepare('UPDATE usuarios SET xp = 0, nivel = 0, ultimo_chat = NULL').run();
      const total = db.prepare('SELECT COUNT(*) as c FROM usuarios').get().c;
      db.close();

      await i.update({
        embeds: [
          new EmbedBuilder()
            .setColor(0x1D9E75)
            .setTitle('✅ Reset concluído!')
            .setDescription(`O XP e nível de **${total} membros** foram zerados.`)
            .setFooter({ text: `Resetado por ${interaction.user.username}` }),
        ],
        components: [],
      });
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.editReply({
          embeds: [new EmbedBuilder().setColor(0x888888).setDescription('⏱️ Tempo esgotado. Reset cancelado.')],
          components: [],
        });
      }
    });
  },
};
