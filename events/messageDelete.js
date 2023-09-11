const {Events, AttachmentBuilder, EmbedBuilder} = require('discord.js');
const dayjs = require('dayjs')

const config = require('../config');

module.exports = {
    name: 'messageDelete',

    async execute(message) {
        console.log("Event triggered")
        if (message.member.user.bot) return

        const guild = message.guild
        const channelToSendLogs = guild.channels.cache.get(config.channels.logs.logsMsg)
        const format = "DD-MM-YYYY HH:mm:ss"
        let deletUser;

        // Récupère les logs d'audit pour trouver l'auteur de la suppression
        const auditLogs = await message.guild.fetchAuditLogs({ type: 72 })
            auditLogs.entries.forEach(el => console.log(el) )
      //  const entry = auditLogs.entries.first();

        //auditLogs.entries.forEach((el) => console.log(el))

/*
        // Vérifie si l'auteur de la suppression est un modérateur
        if (entry && entry.executor) {
                        deletUser = entry.executor.id


        }
*/
        const embed =  new EmbedBuilder()
            .setColor('Random')
            .setTitle(' Supression d\'un message ')
            .setTimestamp()
            //.setFooter({text: "Message deleted detected", iconURL: ""})
            .setDescription(`            
            > - **Metadata** 
            > Channels: <#${message.channel.id}>  
            > Autheur du message: <@${message.member.id}>
            > Supprimer par: <@${deletUser}>
            > Heure message envoyer: \`\`${dayjs(message.createdTimestamp)}\`\`
            > Heure de supression: \`\`${dayjs(Date.now()).format(format)}\`\`
             
             
            > - **Contenue des message **    
           Message supprimer:   \`\`${message.content}\`\`
        
         
           
            `)

        channelToSendLogs.send({embeds: [embed]})

    }




}



