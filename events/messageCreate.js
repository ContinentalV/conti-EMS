const {Events, AttachmentBuilder} = require('discord.js');


const config = require('../config');

module.exports = {
    name: 'messageCreate',

    async execute(message) {

        if (message.channel.type === 1) return
        const channel = message.channel.id
        const member = message.member;
        const citizenRole = message.guild.roles.cache.find(role  => role.id === config.role.citizenRole)

        const unlockCitizen = (msg, member) => {
            console.log(msg)
           member.setNickname(`[CIT] - ${msg.content}`)
            member.roles.add(citizenRole )
        }


        if (channel === config.channel.nomrp) {

            if (!message.author.bot) {
                message.delete()
                unlockCitizen(message, member)
            }


        }


    }

}



