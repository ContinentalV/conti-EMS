const {SlashCommandBuilder} = require('discord.js');
/**
 * @command /purges
 * @description Cette commande permet de clear les 100 derniers message d'un channel
 * @usage /purge
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Purge messages'),

    async execute(interaction) {
        const {options, member, guild, client, user} = interaction;
        const msg = await interaction.channel.messages.fetch({limit: 100, before: interaction.id});
        await interaction.channel.bulkDelete(msg, true);
        await interaction.reply({content: `Purged ${msg.size} messages!`, ephemeral: true});


    }
}