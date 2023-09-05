const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')

const axios = require("axios");



module.exports = {
    data: new SlashCommandBuilder()
        .setName('json')
        .setDescription('Récupère les information sur un joueur INGAME.')
        .addStringOption(option =>
            option
                .setName('discord-id')
                .setDescription("Requete par discord.")
        ),


    async execute(interaction) {



    }
}