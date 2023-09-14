const { SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const dayjs = require('dayjs')
const employe  = require('../../models/employe')
/**
 * @command /pds
 * @description Cette commande renvoie permet de prendre ca pds.
 * @usage /pds
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pds')
        .setDescription('Prendre son service'),
    async execute(interaction) {

        const {member, user, client, guild} = interaction;
        const date =  Date.now()
        const EMS = await  employe.findOne({id: user.id})
        if(!EMS) return interaction.reply({content: "Vous n'êtes pas autoriser a effectuer cette commande."})
        if(EMS.isService) return interaction.reply({content: "Vous êtes déjà en service."})

        EMS.service.pds = date
        EMS.isService = true
        await EMS.save().then((res) => {console.log(res.service)}, {upsert: true})



        const embeds = new EmbedBuilder()
            .setAuthor({name: `Prise de service: ${member.nickname ? member.nickname : user.username }`, iconURL: member.displayAvatarURL({dynamic: true})})
            .setDescription(`> - ${member} <@&${member.roles.highest.id}> - **Prise de service:**  \`\`${dayjs(date).format('DD-MM-YYYY HH:mm:ss')}\`\` `)
            .setThumbnail(client.user.displayAvatarURL({dynamic:true}))
            .setColor("Random")
            .setTimestamp()
            .setFooter({text: "CN5 EMS", iconURL: client.user.displayAvatarURL({dynamic:true})})

interaction.reply({embeds: [embeds]})

    }
}