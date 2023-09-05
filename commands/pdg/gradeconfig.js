const { SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const dbems = require('../../models/employe')
const dbroles = require('../../models/configGrades')
const config = require('../../config')




module.exports = {
  data: new SlashCommandBuilder()
    .setName('grades-config')
    .setDescription('Permet au PDG (uniquement) de configurer le prix des réanimations.  ')
      .addRoleOption(option =>
      option
          .setName('role')
          .setDescription('Selectionnez le role que vous souhaitez update.')
          .setRequired(true)
      )
      .addNumberOption(option =>
      option
          .setName('montant')
          .setDescription('Indiquez le montant de la réanimation')
          .setRequired(true)

      )
  ,
  async execute(interaction) {
    const {client, member, user, guild, options} = interaction

    const dbTarget = await dbems.findOne({id: user.id})
    const dbRoles = dbTarget.grade === config.role.Pdg
    const discordRoles = member.roles.highest.id === config.role.Pdg
    const roleTarget = options.getRole('role')?.id
    const montant = options.getNumber('montant')


    if(!dbRoles || !discordRoles) return interaction.reply({content: "Vous n'êtes pas autoriser a faire cette commande. "})
    const roleToUpdate = await dbroles.findOne({gradeId: roleTarget})

    if(!roleToUpdate || montant < 0) return interaction.reply({content: 'Vous ne pouvez pas mettre de valeur négative' +
        ' / Ce role n\'est pas configurable'})

    roleToUpdate.gradeRatio = montant;
    await roleToUpdate.save()

    const embeds = new EmbedBuilder()
        .setDescription(`Le role <@&${roleTarget}> à bien été mis a jours.\n - > Prix de la réanimation: ${montant} $`)
        .setTimestamp()
        .setColor('Random')
        .setFooter({text: 'request by ' + user.username , iconURL: member.displayAvatarURL({dynamic: true})})

    interaction.reply({embeds: [embeds]})


  }
}