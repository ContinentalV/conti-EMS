const {Events, AttachmentBuilder, EmbedBuilder} = require('discord.js');
const dayjs = require('dayjs')

const config = require('../config');

module.exports = {
    name: 'messageUpdate',

    async execute(oldMessage, newMessage) {
    console.log("Event triggered")
if (oldMessage.member.user.bot) return
        console.log(oldMessage)
        const guild = oldMessage.guild
        const channelToSendLogs = guild.channels.cache.get(config.channels.logs.logsMsg)
        const format = "DD-MM-YYYY HH:mm:ss"
        const old = {
        member: oldMessage.member.user.username,
        memberId: oldMessage.member.id,
        time: oldMessage.createdTimestamp,
        channelId: oldMessage.channel.id,
        msg: oldMessage.content,
        }
        const newMsg =  {
        time: new Date(Date.now()),
        msg: newMessage.content,
        }

        const embed =  new EmbedBuilder()
            .setColor('Random')
            .setTitle('Modification d\'un message ')
            .setTimestamp()
            .setFooter({text: "Message Modification detected", iconURL: oldMessage.member.displayAvatarURL({dynamic:true})})
            .setDescription(`            
            > - **Metadata** 
            > Channels:   <#${old.channelId}> 
            > Heure anciens message: \`\`${dayjs(old.time).format(format)}\`\`
            > Heure de modification: \`\`${dayjs(newMsg.time).format(format)}\`\`
            
            > - **Contenue des message **    
            Anciens Message:   \`\`${old.msg}\`\`
            Nouveau Message:   \`\`${newMsg.msg}\`\`
         
           
            `)

        channelToSendLogs.send({embeds: [embed]})
        
        }




}



