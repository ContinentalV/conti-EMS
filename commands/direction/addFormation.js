const {SlashCommandBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder} = require('discord.js')
const config = require("../../config");



module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-formation')
        .setDescription('ajoute les formation sur le profil de l\'employe')
        .addUserOption(option =>
            option
                .setName('ems')
                .setDescription("Selectionner l'ems qui a passer les formation")

        )

        .addStringOption(option =>
            option
                .setName('formations-ambu')
                .setDescription("Choisir les formation  a appliquer a l'utilisateur")
                .addChoices(
                    {name: "Ambulance basique", value: config.roles.formations.basiqueAmbu},
                    {name: "Ambulance Advanced", value: config.roles.formations.advancedAmbu},

                )
        )
        .addStringOption(option =>
            option
                .setName('formations-chir')
                .setDescription("Choisir les formation  a appliquer a l'utilisateur")
                .addChoices(

                    {name: "Chirugie Basique", value: config.roles.formations.basiqueChir},
                    {name: "Chirugie avancer", value: config.roles.formations.advancedChir},
                )
        )
    ,
    async execute(interaction) {




    }
}
