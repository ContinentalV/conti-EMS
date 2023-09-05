const {Events, ActivityType, EmbedBuilder} = require('discord.js');
const logLoad = require('../logs/logsload');
const config = require('../config')




module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        logLoad('client', `${client.user.username} est prêt: 🪡🆗`, true)

        //VARIABLE
        const guild = client.guilds.cache.get(config.guild.id)
        const channel = guild.channels.cache.get(config.channel.nomrp)

        //CLEAR CHANNEL
        const msgToClear = await channel.messages.fetch({limit: 100})
        const clear = await channel.bulkDelete(msgToClear)



        //MESSAGE DE NOM RP
        const embeds = new EmbedBuilder()
            .setColor('Random')
            .setTitle('<:logo1:1111523948077789244> Bienvenue sur la Radio EMS <:logo1:1111523948077789244>')
            .setDescription('- Afin de débloquer tout les channels de la radio EMS: \n Veuillez notez votre **nom &' +
                ' prénom RP** dans ce channel.')
            .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            .setFooter({text: client.user.username, iconURL: client.user.displayAvatarURL({dymamic: true})})
            channel.send({embeds: [embeds]})


            const channels =  guild.channels.cache.filter((i) =>   i.type !== 4 && i.name.includes('┊'))
                .map((channel) => `${channel.name}: '${channel.id}'`)
        const roles =  guild.roles.cache.map((role) => `${role.name}: '${role.id}'`)

        console.log(channels)
        //console.log(roles)





    }
}