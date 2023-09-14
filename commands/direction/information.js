const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const cv = require('../../models/cv')
const cit = require('../../models/citoyen')
const config = require('../../config')
const {Rules_EMS, Barem_EMS} = require("../../message-predefini");
/**
 * @command /information
 * @description  a voir si je laisse ou opti.
 * @usage /*********************************
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('information-predefini')
        .setDescription('permet d\'envoyer un message d\'information predefinie')
        .addBooleanOption( option =>
            option
                .setName('activate-everyone')
                .setDescription('Si vous mettez l\'option sur true, cela fera une mention @everyone')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('ems')
                .setDescription('Veuillez selectionner le message d\'information a envoyer')

                .addChoices(
                    {name: "Règlement Intérieur", value: 'rules'},
                    {name: "Information sur les payes", value: 'paye'},
                    {name: "Information sur les différent grades & formation", value: 'grades'},
                    {name: "a définir", value: 'building'},
                )

        )

        .addStringOption(option =>
            option
                .setName('citoyen')
                .setDescription('Indiquez votre nom')

        .addChoices(
            {name: "Règlement", value: 'rules_cit'},
            {name: "Recrutement", value: 'recrutement'},
            {name: "comment savoir si des ems sont en service", value: 'service'},
            {name: "a définir", value: 'building'},
        )
        )
        .addChannelOption( option =>
        option
            .setName('channel')
            .setDescription('Choisissez le channel ou envoyer le message')
        ),




    async execute(interaction) {

        const {options, member, guild, client, user} = interaction;
        const emsOption = options.getString('ems')
        const citoyenOption = options.getString('citoyen')
        const channelTarget = options.getChannel('channel')
        let everyOne = options.getBoolean('activate-everyone')
        const embedDefault = new  EmbedBuilder()
            .setColor('Random')
            .setTimestamp()
            .setFooter({text: 'send by ' + user.username, iconURL: member.displayAvatarURL({dynamic: true})})
            .setDescription(Rules_EMS)
            .setThumbnail(client.user.displayAvatarURL({dynamic:true}))



        if(!emsOption && !citoyenOption) return interaction.reply({content: 'Vous devez selectionner un mode d\'information'})
        everyOne = everyOne ? `@everyone` : ''

        // embed EMS INFORMATION





        if(emsOption === "rules") embedDefault.setDescription(Rules_EMS)
        else if (emsOption === 'paye') embedDefault.setDescription(Barem_EMS)
        else if (emsOption ==='grades') embedDefault.setDescription('ezez' )
        else if (citoyenOption === 'rules_cit') embedDefault.setDescription('Rule citoyen')
        else if (citoyenOption === "recrutement") embedDefault.setDescription('Comment se faire recruter')
        else if(citoyenOption === 'service' ) embedDefault.setDescription('Comment savoir si des ems sont en service')

    if(!channelTarget){
        interaction.channel.send({content: `${everyOne}`, embeds: [embedDefault] })
        interaction.reply('⬇️⬇️⬇️⬇️⬇️⬇️⬇️')
    }

    else {
        channelTarget.send({content: everyOne ,embeds:[embedDefault] })
        interaction.reply({content: 'Annonce envoyer dans le channels: ' + '<#'+channelTarget.id + ">" })
    }


        //interaction.reply('message envoyer dans le channel:  - mention everyone: ok')


    }
}