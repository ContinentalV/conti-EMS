const {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType
} = require('discord.js');
const dayjs = require('dayjs')
const employe = require('../../models/employe')
const { minToHeure, showHistoryPds, salaryCalc } = require('../../function/functions')
const { ForceFds, historyButton, backButton,  deleteAbsenceButton } = require('../../config/buttonFile')
const dbgrade = require('../../models/configGrades')
const dbabsence = require('../../models/absence')
const price = require('../../price')
const config = require("../../config");


/**
 * @command [Cnotext] profil ems
 * @description Cette commande renvoie le profil d'un ems.
 * @usage  clic droit sur un agent -> Appplication -> profile EMS
 */

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('EMS PROFILE')
        .setType(2),
    async execute(interaction) {

        const { client, member, user, guild } = interaction

        const EMSDB = await employe.findOne({ id: interaction.targetUser.id })
        const {
            matricule,
            id,
            isService,
            historique,
            reanimation,
            isCity,
            avatar,
            absence
        } = EMSDB


       //console.log(price.EMT.calcSalary(20))
        const rowService = new ActionRowBuilder()
            .addComponents(ForceFds, historyButton, backButton, deleteAbsenceButton);
        let work = await minToHeure(EMSDB.service.workingTime)
        const xRoles = await interaction.guild.members.fetch(interaction.targetUser.id)
        let metierRoleId = xRoles.roles.highest.id
        const metierSalary = Object.values(price.SalaryJob).find(role => role.id === metierRoleId)
        const salaireObject = await metierSalary.calcSalary(reanimation)

        const max = salaireObject.limit ? salaireObject.limit : null
        const gradeRoles = xRoles._roles;
        console.log(gradeRoles)
        const primeSalary= Object.values(price.PrimeGrade).find((role) => gradeRoles.includes(role.id))





      //  const salaryNoFormated = salaryCalc(gradesTarget.gradeRatio, reanimation)
        const salary = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3, style: 'currency', currency:'USD' }).format(salaireObject.salary)
        const salaryPrime = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3, style: 'currency', currency:'USD' }).format(primeSalary.prix)
        const payeTotal =  new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3, style: 'currency', currency:'USD' }).format(salaireObject.salary + primeSalary.prix)

        const embeds = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`Profile de: ${matricule}`)
            .setDescription(`
            ━━━━━━━━━❪❃❫━━━━━━━━━
            
            ${interaction.targetUser} - ${xRoles.roles.highest} 
            > - Temps effectuer: \`\`${work.hours ? ` ${work.hours} Heures et ${work.minute} minutes` : `0 Heures et ${work.minute} minutes`}\`\`
            > - Derniere prise de service: \`\` ${dayjs(EMSDB?.historique[EMSDB?.historique?.length - 1]?.pds).format('DD-MM-YYYY - HH:mm:ss')} \`\`
            > - Total d'absence: \`\` ${absence?.length} \`\` 
            > - Derniere/prochaine absence: \`\` ${dayjs(absence[absence.length -1]?.start).format('DD-MM-YYYY')} \`\` 
           
            ━━━━━━━━━❪❃❫━━━━━━━━━`)
            .addFields(
                {
                    name: `EN PDS`,
                    value: ` \`\`${isService ? `🟢🟢🟢\n>  Démarrer à: ${dayjs(EMSDB.service.pds).format('DD-MM-YYYY - HH:mm:ss')}` : "🔴🔴🔴"}\`\` `,
                    inline: true
                },
                { name: `EN VILLE`, value: ` \`\`${isCity ? "🟢🟢🟢" : "🔴🔴🔴"}\`\` `, inline: true },
                {
                    name: `\u200b`,
                    value: `
                    > - Nombre de réa:\`\`${reanimation}\`\` \
                    
                    > - Paye hebdomadaire:\`\` ${salary}  \`\` 
                    > - Prime:\`\`${salaryPrime}\`\` - <@&${primeSalary.id}>
                    > - Paye total: \`\`${payeTotal}\`\`
                    > - quota rempli:\`\` ${reanimation < 40 ? "Le quota n'a pas été remplis" : "Le quota a bien été remplis"}  \`\`
                    > - paye max:\`\` ${max !== null ? 'Paye maximum atteinte': "Paye max NON ATTEINTE"}  \`\``,
                    inline: false
                })
            .setTimestamp()
            .setThumbnail(avatar)
            .setFooter({ text: `Request by ${member.nickname}`, iconURL: member.displayAvatarURL({ dynamic: true }) })


        if (isService === false) ForceFds.setDisabled(true)
        else { ForceFds.setDisabled(false) }

        const ForceMsgInteraction = await interaction.reply({ embeds: [embeds], components: [rowService] })
        const collector = ForceMsgInteraction.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000 });

        collector.on('collect', async i => {
            if (i.user.id === interaction.user.id) {

                if(i.customId === 'delabsence'){

                    const isAbsenceActive = await dbabsence.find({ id:id})
                    console.log(isAbsenceActive[0] )

                }

                if (i.customId === 'force-fds') {
                    const targetDb = await employe.findOne({ id: interaction.targetUser.id })
                    targetDb.service.fds = Date.now();
                    targetDb.isService = false;
                    await targetDb.save()
                    await targetDb.updateWorkingTime()
                    embeds.data.fields[0].value = `\`\`🔴🔴🔴\`\``
                    await ForceFds.setDisabled(true)
                    await i.update({ embeds: [embeds], components: [rowService] })
                    await i.followUp({ content: 'La pds a bien été forcer', ephemeral: true })
                }
                if (i.customId === 'history') {

                    const embedsHisoty = new EmbedBuilder()
                        .setColor('Random')
                        .setTitle("Detail des pds")
                        .setTimestamp()
                        .setDescription(`
                        ━━━━━━━━━❪❃❫━━━━━━━━━
                        Détails des prise de service de l'agent: ${interaction.targetUser}
                        ━━━━━━━━━❪❃❫━━━━━━━━━ 
                        ${showHistoryPds(historique, 'DD-MM-YYYY - HH:mm:ss').map((shift) => `> - **Début shift:** \`\`${shift.pds}\`\`\n> - **Fin shift:** \`\`${shift.fds}\`\`\n> - **Temps effectuer:** \`\`${shift.working}\`\` `).join('\n\n')}
                        `)
                    backButton.setDisabled(false)
                    await i.update({ embeds: [embedsHisoty], components: [rowService] })
                }

                if (i.customId === 'back') {

                    await i.update({ embeds: [embeds], components: [rowService] })
                }



            }
        })

        collector.on('end', collected => {
            console.log("Click collecter: " + collected.size)
        })

    }
}



























