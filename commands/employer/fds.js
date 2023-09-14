const { SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const dayjs = require('dayjs')
const employe  = require('../../models/employe')

/**
 * @command /fds
 * @description Cette commande renvoie permet de prendre ca fin de service".
 * @usage /fds
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fds')
        .setDescription('Mettre fin a son service'),
    async execute(interaction) {
        const {member, user, client, guild} = interaction;
        const date =  Date.now()
        const EMS = await  employe.findOne({id: user.id})
        if(!EMS) return interaction.reply({content: "Vous n'êtes pas autoriser a effectuer cette commande."})
        if(!EMS.isService) return interaction.reply({content: "Vous avez déjà mis fin a votre service"})

        EMS.service.fds = date
        EMS.isService = false
        await  EMS.save()

        const embeds = new EmbedBuilder()
            .setAuthor({name: `Fin  de service: ${member.nickname ? member.nickname : user.username }`, iconURL: member.displayAvatarURL({dynamic: true})})
            .setDescription(`
            >>> - ${member} <@&${member.roles.highest.id}>
            - **Début de service:**\`\`${dayjs(EMS.service.pds).format('DD-MM-YYYY HH:mm:ss')}\`\`
            - **Fin de service:**\`\`${dayjs(date).format('DD-MM-YYYY HH:mm:ss')}\`\` `)
            .setColor("Random")
            .setTimestamp()
            .setThumbnail(client.user.displayAvatarURL({dynamic:true}))
            .setFooter({text: "CN5 EMS", iconURL: client.user.displayAvatarURL({dynamic:true})})
        await EMS.updateWorkingTime()
            .then(d => d)
            .catch((err) => console.log(err))

        interaction.reply({embeds: [embeds]})
    }
}

