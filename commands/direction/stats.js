const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder,ComponentType, ActionRowBuilder, ButtonStyle,  PermissionFlagsBits} = require('discord.js')
const dayjs = require('dayjs')
const dbems  = require('../../models/employe')
const {finishButton, confirm, clearButton, refused}  = require('../../config/buttonFile')
const {minToHeure} = require("../../function/functions");




module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDefaultMemberPermissions( PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers)
        .setDescription('Voir les différentes statistiques'),
    async execute(interaction) {
        let staffHours = []
        const ems = await dbems.find().sort({'reanimation': -1})
        //console.log(staffs.map((staff) => staff.name))

        const stats =  ems.map((ems) => {
             const convert = minToHeure(ems.service.workingTime)
            let mentions = `<@${ems.id}>`
            let name = ems.matricule.toUpperCase()
            let enService = ems.isService ? ` \`\`🟢🟢🟢\`\` ` : `\`\`🔴🔴🔴\`\``
            let isIg = ""

            return  {name: `\u200b${name}`, value: `
> - pds: ${enService}
> - Time:**${convert.hours ? ` \`\`${convert.hours} H ${convert.minute} Min\`\`` : `\`\`${convert.minute}Min\`\` `}**
> - Nombre de réanimation: \`\`${ems.reanimation}\`\`
> - ${mentions}
\u200b
`, inline: true}


        })


        //const statsWorking = staffHours.map((staff) => {return {name:`${staff.name}`, value:`<@${staff.id}>\n
        // ${staff.workingTime} `, inline: true }})
        const {member, user, client, guild} = interaction;
        const embeds = new EmbedBuilder()
            .setTitle("Statistiques EMS")
            .setColor('Random')
            .setDescription(`>  - Ci dessous un résumer de l'activité des heures Ems. Du plus d'heures au moins d'heure. `)
            .addFields(stats)

            .setTimestamp()
            // .setThumbnail(client.user.displayAvatarURL({dynamic:true}))
            .setFooter({text: `Request by: ${user.username}`, iconURL: member.displayAvatarURL({dynamic: true})})




        const row = new ActionRowBuilder()
            .addComponents(clearButton, finishButton);
        const rowConfirm = new ActionRowBuilder()
            .addComponents(confirm, refused)

        const StatistiqueEmbed = await  interaction.reply({content: "Commande stats en cours de création. ", embeds: [embeds], components: [row], ephemeral:true})

        const collector =  await StatistiqueEmbed.createMessageComponentCollector({componentType: ComponentType.Button, time: 300_000})


        try{
            collector.on('collect',  async i  => {

                if(i.user.id !== interaction.user.id){
                    await i.update({content: "**VA BIEN TFAIRE ENCULER JAI DIS PAS TOUCHE AU BOT**", embeds: [], components: []})
                }
                if(i.user.id === interaction.user.id){
                    if(i.customId === 'finish'){
                        await StatistiqueEmbed.delete()
                    }
                    /*
                    if(i.customId === "sheet"){
                        await sendSheetData()
                        await i.update({components: [row]})
                        await i.followUp({content: 'Les données ont bien été envoyer sur le google sheet', ephemeral: true})
                    }
    */
                    if(i.customId === 'clear'){

                        let confirm = await i.reply({content: '**CONFIRMEZ VOUS LE RESET?** \n__Cette action est irreversible__'
                            , components: [rowConfirm],embeds: [], ephemeral:true})

                        const collectorFilter = i => i.user.id === interaction.user.id;

                        try {
                            const confirmation = await confirm.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
                            if (confirmation.customId === 'confirm') {

                                ems.forEach((ems) => {

                                    ems.resetTimeFn()
                                })
                                await confirmation.update({content: "Vous venez de clear les heures avec succes.", components:[]})

                            }
                            if(confirmation.customId === 'refused'){
                                await confirmation.update({content: "Vous venez d'annuler le clear", components:[]})
                            }

                        } catch (e) {
                            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
                        }

                    }

                }


            })
            collector.on('end', collected => {
                console.log("Click collecter: " + collected.size)
            })
        }catch (e) {
            return interaction.reply({content: JSON.stringify(e)})
        }
    }
}