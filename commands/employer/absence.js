const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle} = require('discord.js')


/**
 * @command /absence
 * @description Cette commande permet de déclarer une absense
 * @usage /absence
 */

module.exports = {
  data: new SlashCommandBuilder()
    .setName('absence')
    .setDescription('Déclarer une absence'),
  async execute(interaction) {



    try {
      const modal = new ModalBuilder()
          .setCustomId('absence')
          .setTitle('Déclarer une absence:')


      const field1 = new TextInputBuilder()
          .setCustomId('reason')
          .setLabel('Raison de l\'absence')
          .setStyle(TextInputStyle.Paragraph)


      const field2 = new TextInputBuilder()
          .setCustomId('départ')
          .setLabel('Date de départ')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Entrez la date de départ')

      const field3 = new TextInputBuilder()
          .setCustomId('retour')
          .setLabel('date de retour')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Entrez la date de retour')






      const firstActionRow = new ActionRowBuilder().addComponents(field1);
      const secondActionRow = new ActionRowBuilder().addComponents(field2);
      const thirdActionRow = new ActionRowBuilder().addComponents(field3);
      modal.addComponents( secondActionRow, thirdActionRow,  firstActionRow);

      await interaction.showModal(modal);





    } catch (err){
      console.log(err)
    }


  }
}