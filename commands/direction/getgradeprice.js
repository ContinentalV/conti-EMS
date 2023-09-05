const { SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const dbgrades = require('../../models/configGrades')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get-grade-barem')
        .setDescription('Obtenir le barem des grades des réanimations. '),
    async execute(interaction) {

    const {client, user, member, options, guild} = interaction;
    const grades = await dbgrades.find().sort({"position": -1})

    const mapGrade = grades.map((grade) => `> <@&${grade.gradeId}> \n> Montant: \`\`${grade.gradeRatio}$\`\` `).join('\n\n')

     const embeds= new EmbedBuilder()
         .setDescription(mapGrade)
         .setColor('Random')
         .setTimestamp()
         .setFooter({text: '#Barem 2023', iconURL: client.user.displayAvatarURL({dynamic:true})})
         .setThumbnail(member.displayAvatarURL({dynamic: true}))

        interaction.reply({embeds: [embeds]})

    }
}