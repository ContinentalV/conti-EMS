const { SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const emsdb = require('../../models/employe')


/**
 * @command /timeEdit
 * @description manipule le temps / rea d'un employer.
 * @usage   /timeEdit { mode, manage-time, valeur , employer}
 */


module.exports = {
    data: new SlashCommandBuilder()
        .setName('time-edit')
        .setDescription('Modifier le temps sur une pds d\'un employe ems ')
        .addStringOption(option =>
            option
                .setName('manage-time')
                .setDescription('Choissisez si vous voulez ajouter/retirer du temps sur une pds ou des réa.')
                .addChoices(
                    {name: "Ajouter", value: "add"},
                            {name: "Retirer", value: "remove"},
                )
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('mode')
                .setDescription('Choissisez si vous voulez ajouter/retirer du temps sur une pds ou des réa.')
                .addChoices(
                    {name: "Réanimation", value: "rea"},
                    {name: "Temps", value: "time"},
                )
                .setRequired(true)
                        )
        .addNumberOption(option =>
            option
                .setName('valeur')
                .setDescription('indiquez le nombre de réa ou la valeur du temps en minutes')
                .setRequired(true)

        )
        .addMentionableOption(option =>
            option
                .setName('employer')
                .setDescription('Selectionner l\'employer')
                .setRequired(true)

        )
    ,
    async execute(interaction) {

        const {user, member, guild, client, options} = interaction;

        let ManageTime, mode, value, employer
        ManageTime = options.getString('manage-time')
        mode = options.getString('mode')
        value = parseInt(options.getNumber('valeur'))
        employer = options.getMentionable('employer')
        const targetDbEms = await emsdb.findOne({id: employer.id})
        console.log(value)


        if (value <= 0) return interaction.reply({content: 'Vous ne pouvez pas inserez de valeur négative.'})
        const embeds = new EmbedBuilder()
            .setTitle('Modificateur profile EMS')
            .setColor('Random')
            .setFooter({text: "Execute by " + member.nickname, iconURL: member.displayAvatarURL({dynamic:true})})
            .setTimestamp()
            .setThumbnail(targetDbEms.avatar)




        if(ManageTime === "add"){
            if(mode === 'rea'){
                targetDbEms.addRea(value)
                const desc  = `> Vous venez d'ajouter avec succès: ${value} ${mode} a l'employer ${employer} `
                embeds.setDescription(desc)

            } else if(mode === 'time'){
                targetDbEms.addTime(value)
                const desc  = `> Vous venez d'ajouter avec succès: ${value} Minutes a l'employer ${employer} `
                embeds.setDescription(desc)

            }




        } else if (ManageTime === "remove"){
            if(mode === 'rea'){
                targetDbEms.removeRea(value)
                const desc  = `> Vous venez  de retirer avec succès: ${value} ${mode} a l'employer ${employer} `
                embeds.setDescription(desc)
            } else if(mode === 'time'){
                targetDbEms.removeTime(value)
                const desc  = `> Vous venez de retirer avec succès: ${value} Minutes a l'employer ${employer} `
                embeds.setDescription(desc)
            }


        }

interaction.reply({embeds: [embeds]})
    }
}