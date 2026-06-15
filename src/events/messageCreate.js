const { podeGanharXpChat, atualizarUltimoChat, addXp } = require('../utils/database');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const { id, username } = message.author;

    if (podeGanharXpChat(id, username)) {
      atualizarUltimoChat(id);
      const resultado = addXp(id, username, 10);

      if (resultado.subiu) {
        await message.channel.send(
          `🎉 <@${id}> subiu para o **Nível ${resultado.nivel}**! (${resultado.xp} XP total)`
        );
      }
    }
  },
};
